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
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			logger.error(err);
		}
		if(!course){
			logger.debug('getUnitProgress: No Course Found');
			res.status(422).json({message: 'Invalid Course ID'});
		} else {
			var unit = course.units.id(req.params.unit_id);
	
			var unitProgress = 0; 
			var unitItem = req.user.local.academyProgress.filter(m => m.itemId == unit._id);
			if(unitItem.length>0){
				unitProgress = Math.round(unitItem[0].itemProgress);
			}
	
			res.status(200).json({progress: unitProgress});
		}	
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
	User.findById(req.params.user_id, function(err,user){
		if(err){
			logger.error(err);
		}

		if(!user){
			res.status(422).json({message: 'No User matches that ID'})
		} else {
		// Next, find the Course level information

			Course.findById(req.params.course_id, function(err,course){
				if(err){
					logger.error(err);
				}
				
				if(!course){
					res.status(422).json({message: 'No course matches that ID'});
				} else {
				// check if the course exists, if not Add it
	
					let courses = user.local.academyProgress.filter( c => c.itemId == course._id);
		
					if(courses.length == 0){
						var courseAcademyProgress = {
							itemId: req.params.course_id,
							itemProgress: 0,
							itemCompleted: false
						};
		
						user.local.academyProgress.push(courseAcademyProgress);
		
						user.save(function(err){
							if(err){
								logger.error(err);
							}
					
							res.status(200).json({message: 'Course Added to User'});
						});
					} else {
						res.status(200).json({message: 'Course Already Exists'});
					}
				}
			});
		}
	});

};


function makeCourseProgress(c,p){
    
	let courseProgress = {};
	let courseSize = 0;
	let courseCompleted = false;
	let courseModulesCompleted = 0;

	c.units.forEach(function(u){
		let unit =p.filter( progressItem => progressItem.itemId == u._id.toString());
		if(unit.length>0){
			if(unit[0].itemCompleted == true){
				u.modules.forEach(function(m){
					courseSize++;
					courseModulesCompleted++;
				});
			} else {
				u.modules.forEach(function(m){
					courseSize++;
					let module =p.filter( progressItem => progressItem.itemId == m._id.toString());
					if(module.length>0){
						if(module[0].itemCompleted == true){
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

	return courseProgress;
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

	// find the user that we want to update.
	User.findById(req.params.user_id, function(err,user){
		if(err){
			logger.error(err);
		}
	
		// First, lets update the User's Progress for the module.
		// get the module we want to update
		let modules = user.local.academyProgress.filter( m => m.itemId == req.params.module_id);
		// check if the module exists, if not Add it
		if(modules.length == 0){
			var moduleAcademyProgress = {
				itemId: req.params.module_id,
				itemProgress: parseFloat(req.body.itemProgress),
				itemCompleted: req.body.itemCompleted
			};
	
			user.local.academyProgress.push(moduleAcademyProgress);
		} else {
			for(var i = 0; i<modules.length; i++){
				modules[i].itemProgress = parseFloat(req.body.itemProgress);
				modules[i].itemCompleted = req.body.itemCompleted;
			}
		}
	
		// Next, find the Unit information necessary to update the user's Academy Progress
		// we will need to find Course level information later
	
		Course.findById(req.params.course_id, function(err,course){
			if(err){
				logger.error(err);
			}
			
			var unit = course.units.id(req.params.unit_id);
			var unitSize = 0;
			var moduleIds = [];
			var quizId = null;
				
			for(var m = 0; m < unit.modules.length; m++){
				var l = unit.modules[m].length;
				unitSize += l;
				var moduleIdString = unit.modules[m]._id.toString();
				moduleIds.push(moduleIdString);
				if(unit.modules[m].type == 'Quiz'){
					quizId = moduleIdString;
				}
			}
	
			// nice object of unit data
			var unitData = {
				unitSize: unitSize,
				moduleIds: moduleIds
			};
			
			// now Compare unitData to user's Academy Progress

			// filter all the modules from user progress that are part of the unit, and completed
			var modulesCompleted = user.local.academyProgress.filter( function(m){
				if(unitData.moduleIds.indexOf(m.itemId)!== -1){
					return m.itemCompleted == true;
				}
			});

			var unitProgress = 0;
			// check if they passed the quiz

			var quizCompletedItem = modulesCompleted.filter(function(m){
				return m.itemId == quizId;
			});

			if(quizCompletedItem.length > 0){
				unitProgress = 100;
			} else {
				// compare unit size to modules completed.
				unitProgress = 100 * ( modulesCompleted.length / unitData.unitSize );
			}

			// now we update the Unit Progress.
			// check if the unit exists, if not Add it

			let units = user.local.academyProgress.filter( u => u.itemId == req.params.unit_id);

			if(units.length == 0){
				var unitCompleted = false;
				if(unitProgress >= 100){
					unitCompleted = true;
				}
				var unitAcademyProgress = {
					itemId: req.params.unit_id,
					itemProgress: unitProgress,
					itemCompleted: unitCompleted
				};
				user.local.academyProgress.push(unitAcademyProgress);
			} else {
				for(var i = 0; i<units.length; i++){
					units[i].itemProgress = unitProgress;
					if(units[i].itemProgress >= 100){
						units[i].itemCompleted = true;
						units[i].itemProgress = 100;					
					}else{
						units[i].itemCompleted = false;
					}
				}
			}

			// filter units again because we have updated for new unit..
			
			// now we need to do something similar at the Course Level. 
			// we dont worry about quizzes but we worry about some badges. 

			var cp = makeCourseProgress(course,user.local.academyProgress);
			
	
			var courseProgress = 100 * (cp.courseModulesCompleted / cp.courseSize);
			// now we update the Course Progress.
			// check if the course exists, if not Add it

			let courses = user.local.academyProgress.filter( c => c.itemId == req.params.course_id);

			if(courses.length == 0){
				var courseCompleted = cp.courseCompleted;
				
				var courseAcademyProgress = {
					itemId: req.params.course_id,
					itemProgress: courseProgress,
					itemCompleted: courseCompleted
				};
				user.local.academyProgress.push(courseAcademyProgress);

			} else {
				for(var j = 0; j<courses.length; j++){
					courses[j].itemProgress = courseProgress;
					if(courses[j].itemProgress >= 100){
						courses[j].itemCompleted = true;
						courses[j].itemProgress = 100;
						// ToDo: put a badge on it 					
					} else {
						courses[j].itemCompleted = false;
					}
				}
			}

			user.save(function(err){
				if(err){
					logger.error(err);
				}	
				res.status(200).json({message: 'User Progress Updated', academyProgress: user.local.academyProgress});
			});
	
		});
	
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

exports.getPasswordSetup = function(req,res){
	res.status(200).render('password.ejs', { message: req.flash('loginMessage') });
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
		}

		res.status(200).render('reset.ejs', { message: req.flash('loginMessage') });
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