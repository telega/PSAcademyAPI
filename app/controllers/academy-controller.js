var Course = require('../models/course');
var Quiz = require('../models/quiz');
var User = require('../models/user');
var Academy = require('../models/academy');
var Feedback = require('../models/feedback');
const { check, validationResult } = require('express-validator/check');
const logger = require('../logger');

//var mongoose = require('mongoose');

function getUserCourseItems(courses, academyProgress){
	// This only gets Course level items, profile page requires longer version
	let items = [];
		
	// cant use array.map 
	courses.forEach(function(course){
		var cidx = academyProgress.map(function(e){return e.itemId;}).indexOf(course._id.toString());
		if(cidx !== -1){
			items.push({
				name: course.name,
				progress: academyProgress[cidx].itemProgress,
				completed: academyProgress[cidx].itemCompleted,
				id: course._id
			});
		}
	});

	return items;
}

function getUserUnitItems(course,academyProgress){
	let items = [];

	course.units.forEach(function(unit){
		let idx = academyProgress.map(function(e){return e.itemId;}).indexOf(unit._id.toString());
		if(idx !== -1){
			items.push({
				name: unit.name,
				progress: academyProgress[idx].itemProgress,
				completed: academyProgress[idx].itemCompleted,
				id: unit._id
			});
		}
	});

	return items;
}

function getUserUnitModuleItems(unit, academyProgress){
	let items = [];

	unit.modules.forEach(function(module){
		let idx = academyProgress.map(function(e){return e.itemId;}).indexOf(module._id.toString());
		if(idx !== -1){
			items.push({
				id: module._id,
				progress:academyProgress[idx].itemProgress,
				completed:academyProgress[idx].itemCompleted
			});
		}
	});

	return items;
}

exports.getFeedback = function(req,res){
	Feedback.find({}).exec()
		.then((feedback) =>{

			let pageInfo = {
				title: 'Feedback',
				breadcrumbs: [
					{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
					{title:'Feedback', url: '/feedback'}
				],
				activeNavItem: 'Feedback',
			};
			res.status(200).render('academy/feedback.ejs', {user: req.user, pageInfo: pageInfo, feedback: feedback});
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).json({message:err});
		});
};


exports.validatePostFeedback = [
	check('title').exists().withMessage('Must exist.'),
	check('description').exists().withMessage('Must exist.'),
	function (req,res,next){
		let errors = validationResult(req);
		if( !errors.isEmpty() ){
			res.status(422).json({message: errors.mapped()});
		} else {
			next();
		}
	}
];


exports.postFeedback = function(req,res){

	let feedback = new Feedback();
	feedback.title = req.body.title;
	feedback.description = req.body.description;
	feedback.suggestedBy = req.user.local.profile.firstName;
	feedback.suggestedByEmail = req.user.local.email;
	feedback.userVotes = [req.user._id.toString()];
	feedback.save((err)=>{
		if(err){
			logger.error(err);
		}
		res.status(200).json({message: 'Feedback Added'});
	});


};

exports.validatePutFeedback = [
	check('voteId').exists().isAlphanumeric().withMessage('Must exist and be Alphanumeric.'),
	check('feedback_id').exists().isAlphanumeric().withMessage('Must exist and be Alphanumeric.'),
	function (req,res,next){
		let errors = validationResult(req);
		if( !errors.isEmpty() ){
			res.status(422).json({message: errors.mapped()});
		} else {
			next();
		}
	}
];

exports.putFeedback = function(req,res){
	Feedback.findOne({_id: req.params.feedback_id}).exec()
		.then((feedback)=>{
			// make sure the user isnt voting again
			if(feedback.userVotes.indexOf(req.body.voteId) == -1){
				feedback.userVotes.push(req.body.voteId);
				feedback.save(()=>{
					res.status(200).json({message: 'Vote Added'});
				});
			}
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).json({message:err});
		});
	
};

exports.getCourses = function(req,res){
	Course.find({}, function(err, courses){
		if(err){
			logger.error(err);
		}

		let items = getUserCourseItems(courses, req.user.local.academyProgress);

		let pageInfo = {
			title: 'Courses',
			breadcrumbs: [
				{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
				{title:'Courses', url: '/courses'}
			],
			activeNavItem: 'Courses',
			jumbotronImageUrl:'https://www.patsnap.com/hubfs/Academy/Images/CoursePageHeaderGettyImages-658984379.jpg' 
		};

		res.render('academy/courses.ejs', {user: req.user, courses: courses, items: items, pageInfo: pageInfo});
	});
};


exports.getGlossary = function(req,res){
	let pageInfo = {
		title: 'IP Glossary',
		breadcrumbs: [
			{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
			{title:'IP Glossary', url: '/glossary'}
		],
		activeNavItem: 'Glossary',
		jumbotronImageUrl:'https://www.patsnap.com/hubfs/Academy/Images/IPGlossaryHeader.jpg' 
	};
	res.render('academy/glossary.ejs', { pageInfo: pageInfo});

};

exports.getHomepage = function(req,res){
	if(req.user){
		Course.find({}, function(err, courses){
			if(err){
				logger.error(err);
			}

			let items = getUserCourseItems(courses, req.user.local.academyProgress);
			let userCount = 0;

			let pageInfo = {
				title: 'Welcome',
				breadcrumbs: [
					{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'}
				],
				activeNavItem: null,
				jumbotronImageUrl:'https://www.patsnap.com/hubfs/Academy/Images/AcademyWelcomeHeader.jpg' 
			};

			User.find({}).sort({'local.academyScore': -1}).exec()
				.then((users)=>{
					userCount = users.length;
					req.user.local.academyRank = req.user.updateAcademyRank(users);
					return req.user.save();
				})
				.then(()=>{

					Academy.findOne({}, function(err,academyOptions){  
						res.render('academy/academy.ejs', {pageInfo:pageInfo,items:items, user: req.user, options:academyOptions, userCount: userCount});	
					});

				})
				.catch((err)=>{
					if(err){
						logger.error(err);
					}
				});
				
		});

	} else {
		Course.find({}, function(err, courses){
			if(err){
				logger.error(err);
			}

			Academy.findOne({}, function(err,academyOptions){  
				if(err){
					logger.error(err);
				}
	
				if(!academyOptions){
					academyOptions = new Academy();
	
					academyOptions.save(function(err){
						if(err){
							logger.error(err);
						}
	
						res.status(200).render('index.ejs', { courses: courses, options:academyOptions, message: req.flash('loginMessage') });
	
					});
	
				} else {
					res.status(200).render('index.ejs', { courses:courses, options:academyOptions, message: req.flash('loginMessage') });
				}
			});
		});
	}
};

exports.getCourse = function(req,res){
	Course.findById(req.params.course_id, function (err,course){
		if(err){
			logger.error(err);
		}

		var courseProgress = 0; 
		var courseItem = req.user.local.academyProgress.filter(m => m.itemId == course._id);
		if(courseItem.length>0){
			courseProgress = Math.round(courseItem[0].itemProgress);
		}

		let items = getUserUnitItems(course, req.user.local.academyProgress);

		let pageInfo = {
			title: course.name,
			breadcrumbs: [
				{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
				{title:'Courses', url: '/courses'},
				{title:course.name, url: '/courses/'+ course._id}
			],
			activeNavItem: 'Courses',
			jumbotronImageUrl: course.courseImageUrl
		};

		res.status(200).render('academy/course.ejs', {user: req.user, items: items, pageInfo:pageInfo, course: course, courseProgress: courseProgress});
	});
};


exports.getLogin = function(req,res){
	res.status(200).render('academy/login.ejs', { message: req.flash('loginMessage') });
};


exports.getProfile = function(req,res){

	Course.find({}, function(err, courses){
		if(err){
			logger.error(err);
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
					type: 'Course', 
					url: '/courses/' + course._id
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
							url:'/courses/' + course._id + '/units/' + course.units[j]._id
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
									type: 'Module',
									url:'/courses/' + course._id + '/units/' + course.units[j]._id
								});
							}
						}
					}
					
				}
			}
		
		});

		let pageInfo = {
			title: 'Profile',
			breadcrumbs: [
				{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
				{title:'Profile', url: '/profile'}
			],
			activeNavItem: 'Profile',
			jumbotronImageUrl:'https://www.patsnap.com/hubfs/Academy/Images/Academy_PatSnap.jpg' 
		};

		res.render('academy/profile.ejs', {items:items, pageInfo:pageInfo, user: req.user});	
	});
};


exports.updateUserRankingAndScore = function(req,res,next){

	req.user.local.academyScore = req.user.updateUserAcademyScore();

	User.find({}).sort({'local.academyScore': -1}).exec()
		.then((users) =>{	
			req.user.local.academyRank = req.user.updateAcademyRank(users);	
			return req.user.save();
		})
		.then(()=>{
			return next();
		})
		.catch( err => { logger.error(err);} );

};

exports.getLeaderboard = function(req,res){

	let pageInfo = {
		title: 'Leaderboard',
		breadcrumbs: [
			{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
			{title:'Leaderboard', url: '/leaderboard'}
		],
		activeNavItem: 'Leaderboard',
		jumbotronImageUrl:'https://www.patsnap.com/hubfs/Academy/Images/Academy_PatSnap.jpg' 
	};

	let leaderBoardItems =[];

	User.find({}).sort({'local.academyRank': 1}).exec()
		.then((users) =>{

			users.forEach((user)=>{

				if( (user.local.academyRank <=10 ) && ( user.local.academyRank != 0) ){
					leaderBoardItems.push({
						name : user.local.profile.firstName + ' ' + user.local.profile.lastName.slice(0,1),
						rank : user.local.academyRank,
						score: user.local.academyScore,
						isUser: (req.user._id.equals(user._id) )
					});
				}

			});

			res.render('academy/leaderboard.ejs', {pageInfo:pageInfo, user: req.user, items: leaderBoardItems});	
		})
		.catch( err => logger.error(err));
};

exports.putProfile = function(req,res){

	User.findById(req.user._id, function(err, user){
		if(err){
			logger.error(err);
		}

		user.local.profile.firstName = req.body.firstName || user.local.profile.firstName;
		user.local.profile.lastName = req.body.lastName || user.local.profile.lastName;
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


exports.getCourseUnit = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			logger.error(err);
		}
		var unit = course.units.id(req.params.unit_id);

		var unitProgress = 0; 
		var unitItem = req.user.local.academyProgress.filter(m => m.itemId == unit._id);
		if(unitItem.length>0){
			unitProgress = Math.round(unitItem[0].itemProgress);
		}

		let pageInfo = {
			title: unit.name,
			breadcrumbs: [
				{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
				{title:'Courses', url: '/courses'},
				{title:course.name, url: '/courses/'+ course._id},
				{title:unit.name, url: '/courses/' + course._id + /units/ + unit._id}
			],
			activeNavItem: 'Courses',
			jumbotronImageUrl: unit.unitImageUrl
		};

		let items = getUserUnitModuleItems(unit,req.user.local.academyProgress);

		res.render('academy/unit.ejs', {user: req.user, course: course, unit: unit, unitProgress: unitProgress, pageInfo: pageInfo, items: items});
	});
};


exports.getQuiz = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			logger.error(err);
		}

		Quiz.findById({ _id: req.params.quiz_id}, function (err,quiz){
			if(err){
				logger.error(err);
			}

			var unit = course.units.id(req.params.unit_id);

			let pageInfo = {
				title: '' + unit.name + ' - Quiz',
				breadcrumbs: [
					{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
					{title:'Courses', url: '/courses'},
					{title:course.name, url: '/courses/'+ course._id},
					{title:unit.name, url: '/courses/' + course._id + /units/ + unit._id},
					{title:'Quiz', url: '/courses/' + course._id + /units/ + unit._id + '/quiz/' + quiz._id}
				],
				activeNavItem: 'Courses',
				jumbotronImageUrl: unit.unitImageUrl
			};
			res.render('academy/quiz.ejs', {user: req.user, pageInfo:pageInfo,course: course, unit: unit, quiz: JSON.stringify(quiz)});
		});

	});
};
