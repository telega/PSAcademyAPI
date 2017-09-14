var User = require('../models/user');
var Course = require('../models/course');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
const sgKey = process.env.SENDGRID_API_KEY;
//const sgUser = process.env.SENDGRID_USER;

//const passport = require('passport');

// exports.postUser = function(req,res){
// 	var user = new User();
// 	res.status(200);	
// };

exports.getUnitProgress = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);

		var unitProgress = 0; 
		var unitItem = req.user.local.academyProgress.filter(m => m.itemId == unit._id);
		if(unitItem.length>0){
			unitProgress = Math.round(unitItem[0].itemProgress);
		}

		res.json({progress: unitProgress});
	});
};

exports.getUsers = function(req,res){
	User.find({}, function(err, users){
		if(err){
			console.log(err);
		}
		res.json({users});
	});
};



exports.addCourseToUser = function(req,res){

	// find the user that we want to update.
	User.findById(req.params.user_id, function(err,user){
		if(err){
			console.log(err);
		}

		// Next, find the Course level information

		Course.findById(req.params.course_id, function(err,course){
			if(err){
				console.log(err);
			}
			
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
						console.log(err);
					}
			
					res.status(200).json({message: 'Course Added to User', user: user});
				});
			} else {
				res.status(200).json({message: 'Course Already Exists'});
			}
		});
	});

};

exports.putModuleProgress = function(req,res){

	// find the user that we want to update.
	User.findById(req.params.user_id, function(err,user){
		if(err){
			console.log(err);
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
				console.log(err);
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
			units = user.local.academyProgress.filter( u => u.itemId == req.params.unit_id);
			// now we need to do something similar at the Course Level. 
			// we dont worry about quizzes but we worry about some badges. 

			var courseSize = 0;
			var unitIds = [];
				
			for(var u = 0; u < course.units.length; u++){
				var ul = course.units[u].modules.length;
				courseSize += ul;
				var unitIdString = course.units[u]._id.toString();
				unitIds.push(unitIdString);
			}

			// nice object of course data
			var courseData = {
				courseSize: courseSize,
				unitIds: unitIds
			};
			
			// now Compare course Data to user's Academy Progress

			// filter all the modules from user progress that are part of the unit, and completed
			var unitsCompleted = user.local.academyProgress.filter( function(u){
				if(courseData.unitIds.indexOf(u.itemId)!== -1){
					return u.itemCompleted == true;
				}
			});

			var courseProgress = 100 * (unitsCompleted.length / courseData.courseSize);
			console.log(courseProgress)
			// now we update the Course Progress.
			// check if the course exists, if not Add it

			let courses = user.local.academyProgress.filter( c => c.itemId == req.params.course_id);

			if(courses.length == 0){
				var courseCompleted = false;
				if(courseProgress >= 100){
					courseCompleted = true;
					courseProgress = 100;
					// ToDo: put a badge on it
				}
				var courseAcademyProgress = {
					itemId: req.params.course_id,
					itemProgress: courseProgress,
					itemCompleted: courseCompleted
				};
				user.local.academyProgress.push(courseAcademyProgress);

				/*LOOK HERE*/ 
			} else {
				for(var j = 0; j<courses.length; j++){
					courses[j].itemProgress = courseProgress;
					if(units[j].itemProgress >= 100){
						units[j].itemCompleted = true;
						units[j].itemProgress = 100;
						// ToDo: put a badge on it 					
					} else {
						units[j].itemCompleted = false;
					}
				}
			}

			user.save(function(err){
				if(err){
					console.log(err);
				}	
				res.status(200).json({message: 'User Progress Updated', user: user});
			});

		});

	});

};

exports.putUser = function(req,res){
	User.findById(req.params.user_id, function(err, user){
		if(err){
			console.log(err);
		}

		user.local.profile.firstName = req.body.firstName || user.local.profile.firstName;
		user.local.profile.lastName = req.body.lastName || user.local.profile.lastName;
		user.local.role = req.body.role || user.local.role;
		user.local.email = req.body.email || user.local.email;
		user.local.password = user.generateHash(req.body.password) || user.local.password;

		user.save(function(err){
			if(err){
				console.log(err);
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
			console.log(err);
			req.flash('loginMessage','An error occured.');
			res.redirect('/forgot');

		}
		if(!user){
			req.flash('loginMessage','No user found with that email address.');
			res.redirect('/forgot');
		}

		var token = crypto.randomBytes(20).toString('hex');

		user.resetPasswordToken = token; 
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

		user.save(function(err){
			if(err){
				console.log(err);
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
				from: 'academy@patsnap.com',
				subject: 'Academy by Patsnap - Password Reset',
				text: 'You are receiving this message because someone has requested the reset of the password for your Academy account.\n\n' +
					'To reset yoru password, please click on the following link (or paste it into your browser):\n\n' +
					'http://' + req.headers.host + '/reset/' + token + '\n\n' +
					'If you did not make this request ignore this email.\n'+
					' The Academy Team\n'
			};


			sgClient.sendMail(email,function(err, info){
				if(err){
					console.log(err);
				} else {
					console.log('Message sent to ' + user.local.email);
				}
			});

			req.flash('loginMessage', 'Message sent to ' + user.local.email + '. Please check your email.');
			res.redirect('/forgot');

		});
	});

};

exports.getReset = function(req,res){
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err,user){
		if(err){
			console.log(err);
		}
		if(!user){
			req.flash('loginMessage','Password reset token is invalid or expired.');
			res.redirect('/forgot');
		}

		res.status(200).render('reset.ejs', { message: req.flash('loginMessage'), user: user});
	});
};

exports.postReset = function(req,res){

User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err,user){
		if(err){
			console.log(err);
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
				console.log(err);
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
				from: 'academy@patsnap.com',
				subject: 'Academy by Patsnap - Password Changed',
				text: 'This is a confirmation that your Academy password has been changed.\n\n' +
						'The Academy Team\n'
			};


			sgClient.sendMail(email,function(err, info){
				if(err){
					console.log(err);
				} else {
					console.log('Message sent to ' + user.local.email );
				}
			});	

			res.redirect('/');
		});



	});


};

exports.deleteUser = function(req,res){
	User.remove({ _id: req.params.user_id }, function(err){
		if(err){
			console.log(err);
		}
		res.status(200).json({message: 'User Deleted'});
	});
};

exports.verifyUser = function(req,res){
	console.log('User Verified');
	res.status(200).json({ message: 'Verified'});
};