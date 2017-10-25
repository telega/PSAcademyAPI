var User = require('../models/user');
var Course = require('../models/course');
var Quiz = require('../models/quiz');
var Academy = require('../models/academy');
var Feedback = require('../models/feedback');
const { check, validationResult } = require('express-validator/check');
const logger = require('../logger');


// General

exports.getAdminPage = function(req,res){
	let pageInfo = {
		title: 'Admin',
		breadcrumbs: [
			{title:'Admin', url: '/admin'},
		],
		activeNavItem: null
	};
	res.render('admin/index.ejs', {user: req.user, page:pageInfo});	
};

// Courses

exports.getCourses = function(req,res){
	let pageInfo = {
		title: 'Courses',
		breadcrumbs: [
			{title:'Admin', url: '/admin'},
			{title:'Courses', url: '/admin/courses'}
		],
		activeNavItem: 'Courses'
	};

	Course.find({}).sort({order:1}).exec()
		.then((courses) =>{
			res.status(200).render('admin/courses.ejs', {user: req.user, courses: courses, page: pageInfo});
		})
		.catch((err) => logger.error(err));
};


exports.getFeedback = function(req,res){
	let pageInfo = {
		title: 'Feedback',
		breadcrumbs: [
			{title:'Admin', url: '/admin'},
			{title:'Feedback', url: '/admin/feedback'}
		],
		activeNavItem: 'Feedback'
	};

	Feedback.find({}).exec()
		.then((feedback) =>{
			res.status(200).render('admin/feedback.ejs', {user: req.user, feedback: feedback, page: pageInfo});
		})
		.catch((err) => logger.error(err));
};

exports.getAcademyOptions = function(req,res){
	let pageInfo = {
		title: 'Academy Options',
		breadcrumbs: [
			{title:'Admin', url: '/admin'},
			{title:'Academy Options', url: '/admin/academy'}
		],
		activeNavItem: 'Options'
	};

	Academy.findOne({}).sort({order:1}).exec()
		.then((academyOptions)=>{
			res.status(200).render('admin/academy.ejs', {user: req.user, options: academyOptions, page: pageInfo});
		})
		.catch((err)=>{
			logger.error(err);
		});
};

exports.validatePutAcademyOptions = [
	check('academyIntroText').exists().withMessage('Must exist.'),
	check('academyNewsHeadline').exists().withMessage('Must exist.'),
	check('academyNewsText').exists().withMessage('Must exist.'),
	check('academyHomeCta').exists().withMessage('Must exist.'),
	function (req,res,next){
		let errors = validationResult(req);
		if( !errors.isEmpty() ){
			res.status(422).json({message: errors.mapped()});
		} else {
			next();
		}
	}
];

exports.putAcademyOptions = function(req,res){
	Academy.findOne({}, function(err, academyOptions){
		if(err){
			logger.error(err);
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
				logger.error(err);
			}
			res.status(200).json({message: 'Options Updated'});
		});
	});
};

exports.getCourse = function(req,res){
	
	Course.findOne({ _id: req.params.course_id}).exec()
		.then((course)=>{
			let pageInfo = {
				title: course.name,
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Courses', url: '/admin/courses'},
					{title:course.name, url: '/admin/courses' + course._id },
				],
				activeNavItem: 'Courses'
			};
	
			res.render('admin/course.ejs', {user: req.user, course: course, page: pageInfo});
		})
		.catch((err)=>{ logger.error(err); });
};


exports.getUnit = function(req,res){

	Course.findById(req.params.course_id).exec()
		.then((course)=>{
			let unit = course.units.id(req.params.unit_id);
			let pageInfo = {
				title: unit.name,
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Courses', url: '/admin/courses'},
					{title:course.name, url: '/admin/courses' + course._id },
					{title:unit.name, url: '/admin/courses' + course._id + '/units/' + unit._id },
				],
				activeNavItem: 'Courses'
			};
			res.render('admin/unit.ejs', {user: req.user, course: course, unit: unit, page:pageInfo});
		})
		.catch((err)=>{logger.error(err);});
};

exports.getModule = function(req,res){
	Course.findById(req.params.course_id).exec()
		.then((course)=>{
			let unit = course.units.id(req.params.unit_id);
			let module = unit.modules.find( m => m._id == req.params.module_id);
			let pageInfo = {
				title: module.name,
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Courses', url: '/admin/courses'},
					{title:course.name, url: '/admin/courses' + course._id },
					{title:unit.name, url: '/admin/courses' + course._id + '/units/' + unit._id },
					{title:module.name, url: '/admin/courses' + course._id + '/units/' + unit._id + '/modules/' + module._id },
				],
				activeNavItem: 'Courses'
			};
			res.render('admin/module.ejs', {user: req.user, course: course, unit: unit, module: module , page: pageInfo });
		})
		.catch((err)=>{logger.error(err);});
};

// Feedback 

exports.putFeedback = function(req,res){
	Feedback.findOne({_id: req.params.feedback_id}).exec()
		.then((feedback)=>{
			feedback.title = req.body.title  || feedback.title;
			feedback.description = req.body.description || feedback.description;
			feedback.published = req.body.published || feedback.published;				
			feedback.save(()=>{
				res.status(200).json({message: 'Vote Added'});
			});			
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).json({message:err});
		});
	
};

exports.deleteFeedback = function(req,res){
	Feedback.remove({_id: req.params.feedback_id}).exec()
		.then(()=>{
			res.status(200).json({message:'feedback deleted'})
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).json({message:err});
		});
	
};

// Quizzes 

exports.getQuizzes = function(req,res){
	Quiz.find({}).exec()
		.then((quizzes)=>{
			let pageInfo = {
				title: 'Quizzes',
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Quizzes', url: '/admin/quizzes'}
				],
				activeNavItem: 'Quizzes'
			};
			res.render('admin/quizzes.ejs', {user: req.user, quizzes: quizzes, page: pageInfo});
		})
		.catch((err)=>{logger.error(err);});
};

exports.getQuiz = function(req,res){
	Quiz.findOne({ _id: req.params.quiz_id}).exec()
		.then((quiz) => {
			let pageInfo = {
				title: quiz.name,
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Quizzes', url: '/admin/quizzes'},
					{title: quiz.name, url: '/admin/quizzes/' + quiz._id }
				],
				activeNavItem: 'Quizzes'
			};
			res.render('admin/quiz.ejs', { user: req.user, quiz: quiz, page:pageInfo });
		})
		.catch((err)=>{logger.error(err);});
};

exports.getQuestion = function(req,res){
	Quiz.findOne({ _id: req.params.quiz_id }).exec()
		.then((quiz) => {
			var question = quiz.questions.id(req.params.question_id);
			let pageInfo = {
				title: 'Quiz Question',
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Quizzes', url: '/admin/quizzes'},
					{title: quiz.name, url: '/admin/quizzes/' + quiz._id },
					{title: quiz.name, url: '/admin/quizzes/' + quiz._id + '/questions/' + question._id}
				],
				activeNavItem: 'Quizzes'
			};
			res.render('admin/question.ejs', { user: req.user, quiz: quiz, question: question, page:pageInfo });
		})
		.catch((err)=>{logger.error(err)});
};

// Users
exports.getUsers = function(req,res){

	User.find({}).exec()
		.then((users)=>{

			let pageInfo = {
				title: 'Users',
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Users', url: '/admin/users'}			
				],
				activeNavItem: 'Users'
			};
			res.status(200).render('admin/users.ejs', {user:req.user, users:users, page: pageInfo});
		})
		.catch((err)=>{ logger.error(err);});
};

exports.getUser = function(req,res){
	

	User.findById({ _id: req.params.user_id }).exec()
		.then((user) => {

			let pageInfo = {
				title: '' + user.local.profile.firstName + ' ' + user.local.profile.lastName ,
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Users', url: '/admin/users'},
					{title: '' + user.local.profile.firstName + ' ' + user.local.profile.lastName , url: '/admin/users/' + user._id}				
				],
				activeNavItem: 'Users'
			};

			Course.find({}).exec()
				.then((courses) => {
				
					let items = [];
	
					// cant use array.map 
					courses.forEach(function(course){
			
						let cidx = user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course._id.toString());
						if(cidx !== -1){
							items.push({
								name: course.name,
								progress: user.local.academyProgress[cidx].itemProgress,
								completed: user.local.academyProgress[cidx].itemCompleted,
								type: 'Course'
							});
						}
			
						if(course.units.length > 0){
							for(let j = 0; j < course.units.length; j++){
			
								let uidx = user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course.units[j]._id.toString());
								if(uidx !== -1){
									items.push({
										name: course.units[j].name,
										progress: user.local.academyProgress[uidx].itemProgress,
										completed: user.local.academyProgress[uidx].itemCompleted,
										type: 'Unit',
									});
								}
			
								if(course.units[j].modules.length > 0 ){
									for(let k = 0; k < course.units[j].modules.length; k++){
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

					return items;
				})
				.then((items)=>{
					res.render('admin/user.ejs', {user: user, page:pageInfo, items: items});
				});
		})
		.catch( (err)=>{ logger.error(err);} );
};

exports.getLeaderboard= function(req,res){

	User.find({}).sort({'local.academyScore': -1}).exec()
		.then((users)=>{

			let pageInfo = {
				title: 'Leaderboard',
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Leaderboard', url: '/admin/leaderboard'}			
				],
				activeNavItem: 'Leaderboard'
			};
			res.status(200).render('admin/leaderboard.ejs', {user:req.user, users:users, page: pageInfo});
		})
		.catch((err)=>{ logger.error(err);});
};
