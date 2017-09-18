var User = require('../models/user');
var Course = require('../models/course');
var Quiz = require('../models/quiz');
var Academy = require('../models/academy');

// General

exports.getAdminPage = function(req,res){
	let pageInfo = {
		title: 'Admin'
	};

	res.render('admin/index.ejs', {user: req.user, page:pageInfo});	
};

// Courses

exports.getCourses = function(req,res){
	let pageInfo = {
		title: 'Courses'
	};

	Course.find({}).sort({order:1}).exec(function(err, courses){
		if(err){
			console.log(err);
		}
		
		res.render('admin/courses.ejs', {user: req.user, courses: courses, page: pageInfo});
	});
};


exports.getAcademyOptions = function(req,res){
	let pageInfo = {
		title: 'Academy Options'
	};

	Academy.findOne({}).sort({order:1}).exec(function(err, academyOptions){
		if(err){
			console.log(err);
		}
		
		res.render('admin/academy.ejs', {user: req.user, options: academyOptions, page: pageInfo});
	});
};

exports.putAcademyOptions = function(req,res){
	Academy.findOne({}, function(err, academyOptions){
		if(err){
			console.log(err);
		}
		if(!academyOptions){
			academyOptions = new Academy();
			academyOptions.academyIntroText = req.body.academyIntroText;
			academyOptions.academyNewsHeadline = req.body.academyNewsHeadline;
			academyOptions.academyNewsText = req.body.academyNewsText;
			academyOptions.academyHomeCta = req.body.academyHomeCta;
		} else {
			academyOptions.academyIntroText = req.body.academyIntroText || academyOptions.academyIntroText;
			academyOptions.academyNewsHeadline = req.body.academyNewsHeadline || academyOptions.academyNewsHeadline;
			academyOptions.academyNewsText = req.body.academyNewsText || academyOptions.academyNewsText; 
			academyOptions.academyHomeCta = req.body.academyHomeCta || academyOptions.academyHomeCta; 
		}

		academyOptions.save(function(err){
			if(err){
				console.log(err);
			}
			res.status(200).json({message: 'Options Updated'});
		});
	});
};

exports.getCourse = function(req,res){
	let pageInfo = {
		title: 'Course'
	};

	Course.findOne({ _id: req.params.course_id}, function (err,course){
		if(err){
			console.log(err);
		}
		res.render('admin/course.ejs', {user: req.user, course: course, page: pageInfo});
	});
};


exports.getUnit = function(req,res){
	let pageInfo = {
		title: 'Unit'
	};
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);
		res.render('admin/unit.ejs', {user: req.user, course: course, unit: unit, page:pageInfo});
	});
};

exports.getModule = function(req,res){
	let pageInfo = {
		title: 'Module'
	};
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);
		let module = unit.modules.filter( m => m._id == req.params.module_id);
		res.render('admin/module.ejs', {user: req.user, course: course, unit: unit, module: module[0] , page: pageInfo });

	});
};

// Quizzes 

exports.getQuizzes = function(req,res){
	let pageInfo = {
		title: 'Quizzes'
	};
	Quiz.find({}, function(err, quizzes){
		if(err){
			console.log(err);
		}
		res.render('admin/quizzes.ejs', {user: req.user, quizzes: quizzes, page: pageInfo});
	});
};

exports.getQuiz = function(req,res){
	let pageInfo = {
		title: 'Quiz'
	};
	Quiz.findOne({ _id: req.params.quiz_id}, function (err, quiz){
		if(err){
			console.log(err);
		}
		res.render('admin/quiz.ejs', { user: req.user, quiz: quiz, page:pageInfo });
	});
};

exports.getQuestion = function(req,res){
	let pageInfo = {
		title: 'Quiz Question'
	};

	Quiz.findOne({ _id: req.params.quiz_id }, function(err, quiz){
		if(err){
			console.log(err);
		}

		var question = quiz.questions.id(req.params.question_id);
		res.render('admin/question.ejs', { user: req.user, quiz: quiz, question: question, page:pageInfo });
	});
};

// Users
exports.getUsers = function(req,res){
	let pageInfo = {
		title: 'Users'
	};
	User.find({}, function(err, users){
		if(err){
			console.log(err);
		}
		res.render('admin/users.ejs', {user:req.user, users:users, page: pageInfo});
	});
};

exports.getUser = function(req,res){
	let pageInfo = {
		title: 'User'
	};
	User.findById({ _id: req.params.user_id }, function (err,user){
		if(err){
			console.log(err);
		}

		Course.find({}, function(err, courses){
			if(err){
				console.log(err);
			}

			let items = [];
			// cant use array.map 
			courses.forEach(function(course){
	
				var cidx = user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course._id.toString());
				if(cidx !== -1){
					items.push({
						name: course.name,
						progress: user.local.academyProgress[cidx].itemProgress,
						completed: user.local.academyProgress[cidx].itemCompleted,
						type: 'Course'
					});
				}
	
				if(course.units.length > 0){
					for(var j = 0; j < course.units.length; j++){
	
						var uidx = user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course.units[j]._id.toString());
						if(uidx !== -1){
							items.push({
								name: course.units[j].name,
								progress: user.local.academyProgress[uidx].itemProgress,
								completed: user.local.academyProgress[uidx].itemCompleted,
								type: 'Unit',
							});
						}
	
						if(course.units[j].modules.length > 0 ){
							for(var k = 0; k < course.units[j].modules.length; k++){
								var idx = user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course.units[j].modules[k]._id.toString());
								if( idx !== -1){
									items.push({
										name: course.units[j].modules[k].name,
										progress: user.local.academyProgress[idx].itemProgress,
										completed: user.local.academyProgress[idx].itemCompleted,
										type: 'Module'
									});
								}
							}
						}
						
					}
				}
	
	
			
			});
	
			res.render('admin/user.ejs', {user: user, page:pageInfo, items: items});
	
		});
	});
};
