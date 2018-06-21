var User = require('../models/user');
var Course = require('../models/course');
var Quiz = require('../models/quiz');
var Academy = require('../models/academy');
var Feedback = require('../models/feedback');
var GlossaryTerm = require('../models/glossary');
var Tag = require('../models/tag');
var mongoose = require('mongoose');
const _ = require('lodash');
const { check, validationResult } = require('express-validator/check');
const logger = require('../logger');



// General

exports.getAdminPage = function(req,res){
	let pageInfo = {
		title: 'Admin',
		breadcrumbs: [
			{title:'Admin', url: '/admin'},
		],
		activeNavItem: null,
		pageUIType: 'ADMIN_HOME'
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
		activeNavItem: 'Courses',
		pageUIType: 'ADMIN_COURSES'
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
		activeNavItem: 'Feedback',
		pageUIType: 'ADMIN_FEEDBACK'
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
		activeNavItem: 'Options',
		pageUIType: 'ACADEMY_OPTIONS'

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
				activeNavItem: 'Courses',
				_id : course._id,
				pageUIType: 'ADMIN_COURSE'
			};
	
			res.render('admin/course.ejs', {user: req.user, course: course, page: pageInfo});
		})
		.catch((err)=>{ logger.error(err); });
};


exports.getUnit = function(req,res){

	Course.findById(req.params.course_id).exec()
		.then((course)=>{
			let unit = course.units.id(req.params.unit_id);

			Tag.find({}).exec()
				.then((tags)=>{
					let activeTags = tags.filter((tag)=>{
						return _.findIndex(tag.units, {'unit': mongoose.Types.ObjectId(req.params.unit_id)}) != -1;
					});
					let pageInfo = {
						title: unit.name,
						breadcrumbs: [
							{title:'Admin', url: '/admin'},
							{title:'Courses', url: '/admin/courses'},
							{title:course.name, url: '/admin/courses/' + course._id },
							{title:unit.name, url: '/admin/courses/' + course._id + '/units/' + unit._id },
						],
						activeNavItem: 'Courses',
						pageUIType: 'ADMIN_UNIT'
					};
					res.render('admin/unit.ejs', {user: req.user, course: course, unit: unit, page:pageInfo, activeTags: activeTags, tags: tags});
				});
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
					{title:course.name, url: '/admin/courses/' + course._id },
					{title:unit.name, url: '/admin/courses/' + course._id + '/units/' + unit._id },
					{title:module.name, url: '/admin/courses/' + course._id + '/units/' + unit._id + '/modules/' + module._id },
				],
				activeNavItem: 'Courses',
				pageUIType: 'ADMIN_MODULE'
			};
			res.render('admin/module.ejs', {user: req.user, course: course, unit: unit, module: module , page: pageInfo });
		})
		.catch((err)=>{logger.error(err);});
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
				activeNavItem: 'Quizzes',
				pageUIType: 'ADMIN_QUIZZES'
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
				activeNavItem: 'Quizzes',
				pageUIType: 'ADMIN_QUIZ'
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
				activeNavItem: 'Quizzes',
				pageUIType: 'ADMIN_QUESTIONS'
			};
			res.render('admin/question.ejs', { user: req.user, quiz: quiz, question: question, page:pageInfo });
		})
		.catch((err)=>{ logger.error(err); });
};

// Glossary Terms

exports.getGlossary = function (req,res){
	GlossaryTerm.find({}).collation({locale:'en', caseLevel: true}).sort({heading:1}).exec()
		.then((glossaryTerms)=>{
			let pageInfo = {
				title: 'Glossary',
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Glossary', url: '/admin/glossary'}			
				],
				activeNavItem: 'Glossary',
				pageUIType: 'ADMIN_GLOSSARY'
			};
			res.status(200).render('admin/glossary.ejs', {user: req.user, glossaryTerms: glossaryTerms, page: pageInfo});
		})
		.catch((err)=>{ logger.error(err); });
};

exports.getGlossaryTerm = function (req,res){
	GlossaryTerm.findOne({ _id: req.params.term_id}).exec()
		.then((term)=>{
			let pageInfo = {
				title: 'Glossary',
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Glossary', url: '/admin/glossary'},
					{title:term.heading, url: '/admin/glossary/' + term._id}			
				],
				activeNavItem: 'Glossary',
				pageUIType: 'ADMIN_GLOSSARY_TERM'
			};
			res.status(200).render('admin/glossaryTerm.ejs', {user: req.user, term: term, page: pageInfo});
		})
		.catch((err)=>{ logger.error(err); });
};

// Tags

exports.getTags = function (req,res){
	Tag.find({}).collation({locale:'en', caseLevel: true}).sort({name:1}).exec()
		.then((tags)=>{
			let pageInfo = {
				title: 'Tags',
				breadcrumbs: [
					{title:'Admin', url: '/admin'},
					{title:'Tags', url: '/admin/tags'}			
				],
				activeNavItem: 'Tags',
				pageUIType: 'ADMIN_TAGS'
			};
			res.status(200).render('admin/tags.ejs', {user: req.user, tags: tags, page: pageInfo});
		})
		.catch((err)=>{ logger.error(err); });
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
				activeNavItem: 'Users',
				pageUIType: 'ADMIN_USERS'
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
				activeNavItem: 'Users',
				pageUIType: 'ADMIN_USER'
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


exports.refreshUsers = function(req,res){
	console.time('refresh_users');
	User.find({}).sort({'local.academyScore': -1}).exec()
		.then((users) =>{
			users.forEach((user)=>{
				user.local.academyScore = user.updateUserAcademyScore();
				user.local.academyRank = user.updateAcademyRank(users);
				user.save();
			});
		})
		.then(()=>{
			logger.info('Admin initiated user score refresh.');
			res.status(200).json({message: 'Refreshed Users'});
			console.timeEnd('refresh_users');
		})
		.catch((err)=>{ logger.error(err);});

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
				activeNavItem: 'Leaderboard',
				pageUIType: 'ADMIN_LEADERBOARD'
			};
			res.status(200).render('admin/leaderboard.ejs', {user:req.user, users:users, page: pageInfo});
		})
		.catch((err)=>{ logger.error(err);});
};
