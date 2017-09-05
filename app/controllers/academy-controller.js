var Course = require('../models/course');
var Quiz = require('../models/quiz');
var User = require('../models/user');
//var mongoose = require('mongoose');

exports.getCourses = function(req,res){
	Course.find({}, function(err, courses){
		if(err){
			console.log(err);
		}
		res.render('academy/courses.ejs', {user: req.user, courses: courses});
	});
};

exports.getHomepage = function(req,res){
	if(req.user){
		Course.find({}, function(err, courses){
			if(err){
				console.log(err);
			}
	
			let items = [];
			// cant use array.map 
			courses.forEach(function(course){
	
				var cidx = req.user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course._id.toString());
				if(cidx !== -1){
					items.push({
						name: course.name,
						progress: req.user.local.academyProgress[cidx].itemProgress,
						completed: req.user.local.academyProgress[cidx].itemCompleted,
						id: course._id
					});
				}
	
			
			});

			res.render('academy/academy.ejs', {items:items, user: req.user});	
		});

	} else {
		res.render('index.ejs');
	}
};

exports.getCourse = function(req,res){
	Course.findById(req.params.course_id, function (err,course){
		if(err){
			console.log(err);
		}
		res.render('academy/course.ejs', {user: req.user, course: course});
	});
};

exports.getProfile = function(req,res){

	Course.find({}, function(err, courses){
		if(err){
			console.log(err);
		}

		let items = [];
		// cant use array.map 
		courses.forEach(function(course){

			var cidx = req.user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course._id.toString());
			if(cidx !== -1){
				items.push({
					name: course.name,
					progress: req.user.local.academyProgress[cidx].itemProgress,
					completed: req.user.local.academyProgress[cidx].itemCompleted,
					type: 'Course'
				});
			}

			if(course.units.length > 0){
				for(var j = 0; j < course.units.length; j++){

					var uidx = req.user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course.units[j]._id.toString());
					if(uidx !== -1){
						items.push({
							name: course.units[j].name,
							progress: req.user.local.academyProgress[uidx].itemProgress,
							completed: req.user.local.academyProgress[uidx].itemCompleted,
							type: 'Unit',
						});
					}

					if(course.units[j].modules.length > 0 ){
						for(var k = 0; k < course.units[j].modules.length; k++){
							var idx = req.user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course.units[j].modules[k]._id.toString());
							if( idx !== -1){
								items.push({
									name: course.units[j].modules[k].name,
									progress: req.user.local.academyProgress[idx].itemProgress,
									completed: req.user.local.academyProgress[idx].itemCompleted,
									type: 'Module'
								});
							}
						}
					}
					
				}
			}


		
		});

		res.render('academy/profile.ejs', {items:items, courses: courses, user: req.user});	
	});
};




exports.getCourseUnit = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);
		res.render('academy/unit.ejs', {user: req.user, course: course, unit: unit});
	});
};


exports.getQuiz = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}

		Quiz.findById({ _id: req.params.quiz_id}, function (err,quiz){
			if(err){
				console.log(err);
			}

			var unit = course.units.id(req.params.unit_id);
			res.render('academy/quiz.ejs', {user: req.user, course: course, unit: unit, quiz: JSON.stringify(quiz)});
		});

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
			
			// now we update the Course Progress.
			// check if the course exists, if not Add it

			let courses = user.local.academyProgress.filter( c => c.itemId == req.params.course_id);

			if(courses.length == 0){
				var courseCompleted = false;
				if(courseProgress >= 100){
					courseCompleted = true;
					// ToDo: put a badge on it
				}
				var courseAcademyProgress = {
					itemId: req.params.course_id,
					itemProgress: courseProgress,
					itemCompleted: courseCompleted
				};
				user.local.academyProgress.push(courseAcademyProgress);
			} else {
				for(var j = 0; j<courses.length; j++){
					courses[j].itemProgress = units[j].itemProgress + courseProgress;
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
				modules[i].itemProgress = modules[i].itemProgress + parseFloat(req.body.itemProgress);
				if(modules[i].itemProgress >= 100){
					modules[i].itemCompleted = true;
					modules[i].itemProgress = 100;					
				}else{
					modules[i].itemCompleted = false;
				}
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
			if(modulesCompleted.indexOf(quizId) !== -1){
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
					units[i].itemProgress = units[i].itemProgress + unitProgress;
					if(units[i].itemProgress >= 100){
						units[i].itemCompleted = true;
						units[i].itemProgress = 100;					
					}else{
						units[i].itemCompleted = false;
					}
				}
			}

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
			
			// now we update the Course Progress.
			// check if the course exists, if not Add it

			let courses = user.local.academyProgress.filter( c => c.itemId == req.params.course_id);

			if(courses.length == 0){
				var courseCompleted = false;
				if(courseProgress >= 100){
					courseCompleted = true;
					// ToDo: put a badge on it
				}
				var courseAcademyProgress = {
					itemId: req.params.course_id,
					itemProgress: courseProgress,
					itemCompleted: courseCompleted
				};
				user.local.academyProgress.push(courseAcademyProgress);
			} else {
				for(var j = 0; j<courses.length; j++){
					courses[j].itemProgress = units[j].itemProgress + courseProgress;
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