var User = require('../models/user');
var Course = require('../models/course');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
const { check, validationResult } = require('express-validator/check');
const sgKey = process.env.SENDGRID_API_KEY;
const logger = require('../logger');

exports.validateGetUnitProgress = [
	check('user_id').exists().isAlphanumeric().withMessage('Must exist and be Alphanumeric'),
	check('course_id').exists().isAlphanumeric().withMessage('Must exist and be Alphanumeric'),
	check('unit_id').exists().isAlphanumeric().withMessage('Must exist and be Alphanumeric'),
	function (req,res,next){
		let errors = validationResult(req);
		if( !errors.isEmpty() ){
			logger.debug('validateGetUnitProgress FAIL');
			res.status(422).json({message: errors.mapped()});
		} else {
			next();
		}
	}
];

exports.getUnitProgress = function(req,res){
	Course.findById(req.params.course_id).exec()
		.then((course)=>{
			if(!course){
				logger.debug('getUnitProgress: No Course Found');
				res.status(422).json({message: 'Invalid Course ID'});
			} else {
				let unit = course.units.id(req.params.unit_id);
				let unitProgress = 0; 
				let unitItem = req.user.local.academyProgress.find(m => m.itemId == unit._id);
				if(unitItem){
					unitProgress = Math.round(unitItem.itemProgress);
				}
				res.status(200).json({progress: unitProgress});
			}
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).json({message:err});
		});
};

exports.getUsers = function(req,res){
	User.find({}, function(err, users){
		if(err){
			logger.error(err);
		}
		res.json({users});
	});
};

exports.validateAddCourseToUser =[
	check('user_id').exists().isAlphanumeric().withMessage('Must exist and be an Alphanumeric'),
	check('course_id').exists().isAlphanumeric().withMessage('Must exist and be an Alphanumeric'),
	function (req,res,next){
		let errors = validationResult(req);
		if( !errors.isEmpty() ){
			logger.debug('validateAddCourseToUser FAIL');
			res.status(422).json({message: errors.mapped()});
		} else {
			next();
		}
	}
];

exports.addCourseToUser = function(req,res){

	// find the user that we want to update.
	User.findById(req.params.user_id).exec()
		.then( function(user){
		
			if(!user){
				res.status(422).json({message: 'No User matches that ID'})
			} else {
				// Next, find the Course level information
	
				Course.findById(req.params.course_id).exec()
					.then(function(course){				
						if(!course){
							res.status(422).json({message: 'No course matches that ID'});
						} else {
							// check if the course exists, if not Add it
			
							let userCourse = user.local.academyProgress.find( c => c.itemId == course._id);
				
							if(!userCourse){
								var courseAcademyProgress = {
									itemId: req.params.course_id,
									itemProgress: 0,
									itemCompleted: false
								};
				
								user.local.academyProgress.push(courseAcademyProgress);
				
								user.save(function(){
									res.status(200).json({message: 'Course Added to User'});
								});
							} else {
								res.status(200).json({message: 'Course Already Exists'});
							}
						}
					}).catch((err)=>{
						logger.error(err);
						res.status(500).json({message: err});
					});
			}
		}).catch((err)=>{
			logger.error(err);
			res.status(500).json({message: err});
		});
};

function makeCourseProgress(c,p){
    
	let courseProgress = {};
	let courseSize = 0;
	let courseCompleted = false;
	let courseModulesCompleted = 0;

	c.units.forEach(function(u){
		let unit = p.find( progressItem => progressItem.itemId == u._id.toString());
		if(unit){
			if(unit.itemCompleted == true){
				u.modules.forEach(function(m){
					courseSize++;
					courseModulesCompleted++;
				});
			} else {
				u.modules.forEach(function(m){
					courseSize++;
					let module =p.find( progressItem => progressItem.itemId == m._id.toString());
					if(module){
						if(module.itemCompleted == true){
							courseModulesCompleted++;
						}
					}
				});
			}
		} else {
			u.modules.forEach(function(m){
				courseSize++;
			});
		}

	});

	if(courseSize == courseModulesCompleted){
		courseCompleted = true;
	}

	courseProgress.courseSize = courseSize;
	courseProgress.courseCompleted = courseCompleted;
	courseProgress.courseModulesCompleted = courseModulesCompleted;
	courseProgress.courseProgress =  Math.min(Math.ceil(100 * (courseModulesCompleted / courseSize)), 100); 
	return courseProgress;
}

function makeUnitProgress(u,p){
    
	let unitProgress = {};
	let unitSize = 0;
	let unitCompleted = false;
	let quizCompleted = false;
	let unitModulesCompleted = 0;

	u.modules.forEach(function(m){
		unitSize+=m.length;
		let moduleProgress = p.find( progressItem => progressItem.itemId == m._id.toString());
		if(moduleProgress){
			if(moduleProgress.itemCompleted == true){	
				unitModulesCompleted+=m.length;
				if(m.type=='Quiz'){
					quizCompleted = true;
				}
			} else {
				if( m.type != 'Quiz'){
					unitModulesCompleted += Math.round(m.length*(moduleProgress.itemProgress/100));
				}
			}
		}
	});

	if(quizCompleted == true){
		unitCompleted = true;
		unitProgress.unitProgress = 100;
	} else {
		if(unitSize == unitModulesCompleted){
			unitCompleted = true;
		}
		unitProgress.unitProgress = Math.min(100*(unitModulesCompleted/unitSize), 100);
	}

	unitProgress.unitSize = unitSize;
	unitProgress.unitCompleted = unitCompleted;
	unitProgress.unitModulesCompleted = unitModulesCompleted;
	
	return unitProgress;
}

exports.validatePutModuleProgress = [
	check('user_id').exists().isAlphanumeric().withMessage('Must exist and be Alphanumeric'),
	check('course_id').exists().isAlphanumeric().withMessage('Must exist and be Alphanumeric'),
	check('unit_id').exists().isAlphanumeric().withMessage('Must exist and be Alphanumeric'),
	check('itemProgress').exists().isInt().withMessage('Must exist and be an integer'),
	check('itemCompleted').exists().withMessage('Must exist'),
	function (req,res,next){
		let errors = validationResult(req);
		if( !errors.isEmpty() ){
			logger.debug('validatePutModuleProgress FAIL');
			res.status(422).json({message: errors.mapped()});
		} else {
			next();
		}
	}];


exports.putModuleProgress = function(req,res){
	let message = 'User Progress Updated';

	Course.findById(req.params.course_id).exec()
		.then((course)=>{
		// find the user that we want to update.
			return User.findById(req.params.user_id).exec()
				.then((user)=>{

					// First, lets update the User's Progress for the module.
					// we need to get some information from the course's description of the module.
					let unit = course.units.id(req.params.unit_id);
					let module = unit.modules.find(m => m._id == req.params.module_id);
					// get the users progress for the module we want to update
					let moduleProgressItem = user.local.academyProgress.find( m => m.itemId == req.params.module_id);
		
					// check if the module exists in the users academy progress, if not Add it
					if(!moduleProgressItem){
						let moduleAcademyProgress = {
							itemId: req.params.module_id,
							itemProgress: parseFloat(req.body.itemProgress),
							itemCompleted: req.body.itemCompleted,
							itemType: module.type,
							relatedItem: module._id
						};
						user.local.academyProgress.push(moduleAcademyProgress);
						logger.info('User ' + user.local.email + ' has made progress in a module: ' + module.name);
					} else {				
						moduleProgressItem.itemProgress = parseFloat(req.body.itemProgress);
						moduleProgressItem.itemCompleted = req.body.itemCompleted;
						logger.info('User ' + user.local.email + ' has made progress in a module: ' + module.name);
					}

					// Next, Update Unit Progress

					let unitProgress = makeUnitProgress(unit, user.local.academyProgress);

					// check if the unit exists in users academy progress, if not Add it

					let unitProgressItem = user.local.academyProgress.find( u => u.itemId == req.params.unit_id);
		
					if(!unitProgressItem){
						
						let unitAcademyProgress = {
							itemId: req.params.unit_id,
							itemProgress: unitProgress.unitProgress,
							itemCompleted: unitProgress.unitCompleted,
							itemType:unit.type,
							relatedItem: unit._id
						};
						user.local.academyProgress.push(unitAcademyProgress);
					} else {
						unitProgressItem.itemProgress = unitProgress.unitProgress;
						unitProgressItem.itemCompleted = unitProgress.unitCompleted;
					}					

					//Finally, update the Course Progress.

					let courseProgress = makeCourseProgress(course,user.local.academyProgress);
					
					// check if the course exists in users academy progress, if not Add it
		
					let courseProgressItem = user.local.academyProgress.find( c => c.itemId == req.params.course_id);
		
					if(!courseProgressItem){
						
						let courseAcademyProgress = {
							itemId: req.params.course_id,
							itemProgress: courseProgress.courseProgress,
							itemCompleted: courseProgress.courseCompleted,
							itemType: course.type,
							relatedItem: course._id
						};
						user.local.academyProgress.push(courseAcademyProgress);
		
					} else {
						courseProgressItem.itemProgress = courseProgress.courseProgress;
						courseProgressItem.itemCompleted = courseProgress.courseCompleted;
					}

					return user.save();
		
				})
				.then((user)=>{
					user.local.academyScore = user.updateUserAcademyScore();
					return user.save();	
				});
		})
		.then(()=>{
			res.status(200).json({message: message});
		})
		.catch((err)=>{ 
			logger.warn(err);
			res.status(500).json({message:err});
		});	
};

exports.putUser = function(req,res){
	User.findById(req.params.user_id, function(err, user){
		if(err){
			logger.error(err);
		}

		user.local.profile.firstName = req.body.firstName || user.local.profile.firstName;
		user.local.profile.lastName = req.body.lastName || user.local.profile.lastName;
		user.local.role = req.body.role || user.local.role;
		user.local.email = req.body.email || user.local.email;
		user.local.password = user.generateHash(req.body.password) || user.local.password;

		user.save(function(err){
			if(err){
				logger.error(err);
			}
			res.status(200).json({message: 'User Updated'});
		});
	});
};

exports.getForgot = function(req,res){
	res.status(200).render('forgot.ejs', { message: req.flash('loginMessage') });
};

exports.postForgot = function(req,res){
	User.findOne({ 'local.email' :  req.body.email }, function(err,user){
		if(err){
			logger.error(err);
			req.flash('loginMessage','An error occured.');
			res.redirect('/forgot');
		}

		if(!user){
			req.flash('loginMessage','No Academy user found with that email address.');
			res.redirect('/forgot');
		} else {

			var token = crypto.randomBytes(20).toString('hex');
	
			user.resetPasswordToken = token; 
			user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
	
			user.save(function(err){
				if(err){
					logger.error(err);
				}
			
				var sgOptions = {
					auth: {
						//api_user: sgUser,
						api_key: sgKey
					}
				};
				
				var sgClient = nodemailer.createTransport(sgTransport(sgOptions));
		
				var email = {
					to: user.local.email,
					from: 'Academy by PatSnap <academy@patsnap.com>',
					subject: 'Academy by Patsnap - Password Reset',
					text: 'You are receiving this message because someone has requested the reset of the password for your Academy account.\n\n' +
						'To reset your password, please click on the following link (or paste it into your browser):\n\n' +
						'http://' + req.headers.host + '/reset/' + token + '\n\n' +
						'If you did not make this request ignore this email.\n'+
						' The Academy Team\n',
					html: '<p>You are receiving this message because someone has requested the reset of the password for your Academy account.</p>' +
						'<p>To reset your password, please click on the following link (or paste it into your browser):<br>' +
						'<a href ="http://' + req.headers.host + '/reset/' + token + '">http://' + req.headers.host + '/reset/' + token + '</a></p>' +
						'<p>If you did not make this request ignore this email.</p>'+
						' <p>Thanks<br>The Academy Team</p>'
				};
	
	
				sgClient.sendMail(email,function(err, info){
					if(err){
						logger.error(err);
					} else {
						logger.info('Message sent to ' + user.local.email);
					}
				});
	
				req.flash('loginMessage', 'Message sent to ' + user.local.email + '. Please check your email. Be sure to check your Spam folder.');
				res.redirect('/forgot');
	
			});
		}
	});

};

// Password Setup is intended as temporary fix for converting existing academy users to new system 
// please remove these functions & routes by 2018

exports.getPasswordSetup = function(req,res){
	res.status(200).render('password.ejs', { message: req.flash('loginMessage') });
};

exports.postPasswordSetup = function(req,res){
	User.findOne({ 'local.email' :  req.body.email }, function(err,user){
		if(err){
			logger.error(err);
			req.flash('loginMessage','An error occured.');
			res.redirect('/password');

		}
		if(!user){
			req.flash('loginMessage','No Academy user found with that email address.');
			res.redirect('/password');
		} else {

			var token = crypto.randomBytes(20).toString('hex');
	
			user.resetPasswordToken = token; 
			user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
	
			user.save(function(err){
				if(err){
					logger.error(err);
				}
			
				var sgOptions = {
					auth: {
						//api_user: sgUser,
						api_key: sgKey
					}
				};

				var sgClient = nodemailer.createTransport(sgTransport(sgOptions));
		
				var email = {
					to: user.local.email,
					from: 'Academy by PatSnap <academy@patsnap.com>',
					subject: 'Academy by PatSnap - Setup Password',
					text: 'You are receiving this message to set up the password for your Academy account.\n\n' +
						'To set up your password, please click on the following link (or paste it into your browser):\n\n' +
						'http://' + req.headers.host + '/reset/' + token + '\n\n' +
						'If you did not make this request ignore this email.\n'+
						'\n Thanks! \n The Academy Team\n',
					html: '<p>You are receiving this message to set up the password for your Academy account.</p><p>'+
						'To set up your password, please click on the following link (or paste it into your browser):<br>' +
						'<a href="http://' + req.headers.host + '/reset/' + token + '">http://' + req.headers.host + '/reset/' + token + ' </a></br>' +
						'If you did not make this request ignore this email.</p>'+
						'<p>Thanks!<br> The Academy Team</p>',
				};
	
	
				sgClient.sendMail(email,function(err, info){
					if(err){
						logger.error(err);
					} else {
						logger.info('Message sent to ' + user.local.email);
					}
				});
	
				req.flash('loginMessage', 'Message sent to ' + user.local.email + '. Please check your email. Be sure to check your Spam folder.');
				res.redirect('/password');
	
			});
		}
	});

};

exports.getReset = function(req,res){
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err,user){
		if(err){
			logger.error(err);
		}
		if(!user){
			req.flash('loginMessage','Password reset token is invalid or expired.');
			res.redirect('/forgot');
		} else {
			res.status(200).render('reset.ejs', { message: req.flash('loginMessage') });
		}
	});
};

exports.postReset = function(req,res){

	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err,user){
		if(err){
			logger.error(err);
		}
		if(!user){
			req.flash('loginMessage','Password reset token is invalid or expired.');
			res.redirect('/forgot');
		}

		user.local.password = user.generateHash(req.body.password); 
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		user.save(function(err){
			if(err){
				logger.error(err);
			}
		
			var sgOptions = {
				auth: {
					//api_user: sgUser,
					api_key: sgKey
				}
			};

			var sgClient = nodemailer.createTransport(sgTransport(sgOptions));

			var email = {
				to: user.local.email,
				from: 'Academy by Patsnap <academy@patsnap.com>',
				subject: 'Academy by Patsnap - Password Changed',
				text: 'This is a confirmation that your Academy password has been changed.\n\n' +
						'The Academy Team\n'
			};

			sgClient.sendMail(email,function(err, info){
				if(err){
					logger.error(err);
				} else {
					logger.info('Message sent to ' + user.local.email );
				}
			});	

			res.redirect('/login');
		});

	});

};

exports.deleteUser = function(req,res){
	User.remove({ _id: req.params.user_id }, function(err){
		if(err){
			logger.error(err);
		}
		logger.warn('A user with id ' + req.params.user_id + ' was deleted.');
		res.status(200).json({message: 'User Deleted'});
	});
};

exports.verifyUser = function(req,res){
	logger.info('User Verified');
	res.status(200).json({ message: 'Verified'});
};