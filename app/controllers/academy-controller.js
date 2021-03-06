var Course = require('../models/course');
var Quiz = require('../models/quiz');
var User = require('../models/user');
var Academy = require('../models/academy');
var Feedback = require('../models/feedback');
var GlossaryTerm = require('../models/glossary');
var Tag = require('../models/tag');
const { check, validationResult } = require('express-validator/check');
const logger = require('../logger');
const gravatar = require('gravatar');
const _ = require('lodash');

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

//using gravatars
function getAvatarUrl(req){
	if(req.user){
		return	gravatar.url(req.user.local.email, {s: '75', r: 'pg', d: 'mm'}); 
	} else {
		return null;
	}
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
			let	avatarUrl = getAvatarUrl(req);
			res.status(200).render('academy/feedback.ejs', {user: req.user, pageInfo: pageInfo, feedback: feedback, avatarUrl: avatarUrl});
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
	Course.find({}).sort({order:1}).exec()
		.then((courses)=>{
		
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
			let	avatarUrl = getAvatarUrl(req); 
			res.render('academy/courses.ejs', {user: req.user, courses: courses, items: items, pageInfo: pageInfo, avatarUrl: avatarUrl});
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).json({message:err});
		});
};


exports.getGlossary = function(req,res){
	GlossaryTerm.find({}).collation({locale:'en', caseLevel: true}).sort({heading:1}).exec()
		.then((glossaryTerms)=> {	
			let pageInfo = {
				title: 'IP Glossary',
				breadcrumbs: [
					{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
					{title:'IP Glossary', url: '/glossary'}
				],
				activeNavItem: 'Glossary',
				jumbotronImageUrl:'https://www.patsnap.com/hubfs/Academy/Images/IPGlossaryHeader.jpg' 
			};
			
			let avatarUrl = getAvatarUrl(req);
			res.render('academy/glossary.ejs', { pageInfo: pageInfo, glossaryTerms: glossaryTerms, user: req.user, avatarUrl: avatarUrl});
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).json({message:err});
		});
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
					let	avatarUrl = getAvatarUrl(req);
					Academy.findOne({}, function(err,academyOptions){  
						res.render('academy/academy.ejs', {pageInfo:pageInfo,items:items, user: req.user, options:academyOptions, userCount: userCount, avatarUrl: avatarUrl, courses:courses});	
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
		let	avatarUrl = getAvatarUrl(req);
		res.status(200).render('academy/course.ejs', {user: req.user, items: items, pageInfo:pageInfo, course: course, courseProgress: courseProgress, avatarUrl:avatarUrl});
	});
};


exports.getLogin = function(req,res){
	res.status(200).render('academy/login.ejs', { message: req.flash('loginMessage') });
};

exports.getSignup = function(req,res){

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
				res.status(200).render('academy/signup.ejs', { options:academyOptions, message: req.flash('loginMessage') });
			});
		} else {
			res.status(200).render('academy/signup.ejs', {  options:academyOptions, message: req.flash('loginMessage') });
		}
	});

};


// exports.getProfile = function(req,res){

// 	Course.find({}).exec()
// 		.then((courses)=>{
// 			let items = [];
// 			// cant use array.map 
// 			courses.forEach(function(course){
	
// 				var cidx = req.user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course._id.toString());
// 				if(cidx !== -1){
// 					items.push({
// 						name: course.name,
// 						progress: req.user.local.academyProgress[cidx].itemProgress,
// 						completed: req.user.local.academyProgress[cidx].itemCompleted,
// 						type: 'Course', 
// 						url: '/courses/' + course._id
// 					});
// 				}
	
// 				if(course.units.length > 0){
// 					for(var j = 0; j < course.units.length; j++){
	
// 						var uidx = req.user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course.units[j]._id.toString());
// 						if(uidx !== -1){
// 							items.push({
// 								name: course.units[j].name,
// 								progress: req.user.local.academyProgress[uidx].itemProgress,
// 								completed: req.user.local.academyProgress[uidx].itemCompleted,
// 								type: 'Unit',
// 								url:'/courses/' + course._id + '/units/' + course.units[j]._id
// 							});
// 						}
	
// 						if(course.units[j].modules.length > 0 ){
// 							for(var k = 0; k < course.units[j].modules.length; k++){
// 								var idx = req.user.local.academyProgress.map(function(e){return e.itemId;}).indexOf(course.units[j].modules[k]._id.toString());
// 								if( idx !== -1){
// 									items.push({
// 										name: course.units[j].modules[k].name,
// 										progress: req.user.local.academyProgress[idx].itemProgress,
// 										completed: req.user.local.academyProgress[idx].itemCompleted,
// 										type: 'Module',
// 										url:'/courses/' + course._id + '/units/' + course.units[j]._id
// 									});
// 								}
// 							}
// 						}
						
// 					}
// 				}
			
// 			});
	
// 			let pageInfo = {
// 				title: 'Profile',
// 				breadcrumbs: [
// 					{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
// 					{title:'Profile', url: '/profile'}
// 				],
// 				activeNavItem: 'Profile',
// 				jumbotronImageUrl:'https://www.patsnap.com/hubfs/Academy/Images/Academy_PatSnap.jpg' 
// 			};

// 			return {pageInfo, items};
// 		})
// 		.then((data)=>{

// 			User.find({}).exec()
// 				.then((users)=>{
// 					let	avatarUrl = getAvatarUrl(req);
// 					res.render('academy/profile.ejs', {items:data.items, pageInfo:data.pageInfo, user: req.user, userCount:users.length, avatarUrl: avatarUrl});	
// 				});
// 		})	
// 		.catch( (err) => { logger.error(err); });
// };


exports.getProfile = function(req,res){

	Course.find({}).exec()
		.then((courses)=>{
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

			return {pageInfo, items};
		})
		.then((data)=>{

			User.find({}).exec()
				.then((users)=>{
					let	avatarUrl = getAvatarUrl(req);
					res.render('academy/profile.ejs', {items:data.items, pageInfo:data.pageInfo, user: req.user, userCount:users.length, avatarUrl: avatarUrl});	
				});
		})	
		.catch( (err) => { logger.error(err); });
};



exports.updateUserRankingAndScore = function(req,res,next){

	req.user.local.academyScore = req.user.updateUserAcademyScore();
	req.user.save()
		.then((user)=>{
			User.find({}).sort({'local.academyScore': -1}).exec()
				.then((users) =>{
					user.local.academyRank = req.user.updateAcademyRank(users);	
					return user.save();
				})
				.then(()=>{
					return next();
				})
				.catch( err => { logger.error(err);} );
		})
		.catch( err => { logger.error(err);} );
};


// exports.updateUserRankingAndScore = function(req,res,next){

// 	// this is async and its causing trouble
// 	req.user.local.academyScore = req.user.updateUserAcademyScore();

// 	User.find({}).sort({'local.academyScore': -1}).exec()
// 		.then((users) =>{
// 			req.user.local.academyScore = req.user.updateUserAcademyScore();	
// 			req.user.local.academyRank = req.user.updateAcademyRank(users);	
// 			return req.user.save();
// 		})
// 		.then(()=>{
// 			return next();
// 		})
// 		.catch( err => { logger.error(err);} );

// };

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

				if( (user.local.academyRank <= 10 ) && ( user.local.academyRank != 0) ){
					leaderBoardItems.push({
						name : user.local.profile.userName,
						rank : user.local.academyRank,
						score: user.local.academyScore,
						isUser: (req.user._id.equals(user._id) )
					});
				}

			});
			let	avatarUrl = gravatar.url(req.user.local.email, {s: '75', r: 'pg', d: 'mm'}); 
			res.render('academy/leaderboard.ejs', {pageInfo:pageInfo, user: req.user, items: leaderBoardItems, userCount: users.length, avatarUrl:avatarUrl});	
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
		user.local.profile.userName = req.body.userName || user.local.profile.userName;

		user.save(function(err){
			if(err){
				logger.error(err.message);
				if((err.name == 'ValidationError')){
					logger.error('User Name is not valid - should be unique');
					res.status(400).json({message: 'User Name is not valid - should be unique'});
				}
			} else {
				logger.info('User ' + user.local.email + ' updated their profile.');
				res.status(200).json({message: 'User Updated'});
			}
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
				{title:unit.name, url: '/courses/' + course._id + '/units/' + unit._id}
			],
			activeNavItem: 'Courses',
			jumbotronImageUrl: unit.unitImageUrl
		};

		let items = getUserUnitModuleItems(unit,req.user.local.academyProgress);
		let	avatarUrl = getAvatarUrl(req);
		res.render('academy/unit.ejs', {user: req.user, course: course, unit: unit, unitProgress: unitProgress, pageInfo: pageInfo, items: items, avatarUrl:avatarUrl});
	});
};

exports.getTag = function(req,res){
	// TODO this seems expensive should refactor. 
	Tag.findById(req.params.tag_id).exec()
		.then((tag)=>{

			let courseIds = tag.units.map((u)=>{
				return u.parentCourse;
			}); 

			courseIds = _.uniq(courseIds);
			
			let unitIds = tag.units.map((u)=>{
				return u.unit;
			});

			unitIds = _.uniq(unitIds);

			return Promise.all( [Course.find({_id:{$in:courseIds}}).exec(), unitIds, tag ]);
				
		})
		.then(([courses, unitIds, tag])=>{
			

			let mappedCourses = courses.map((course)=>{
				let filteredUnits = course.units.filter((unit)=>{
	
					return _.findIndex(unitIds, unit._id) != -1;
				});
				course.units = filteredUnits;
				return course;
			});
			
			return [mappedCourses, tag];
		})
		.then(([mappedCourses,tag])=>{

			let results = mappedCourses.map((course)=>{
				let id = course._id;
				let units = course.units.map((unit)=>{
					let id = unit._id;
					let name = unit.name;
					let shortDescription = unit.shortDescription;
					return { id, name, shortDescription };
				});
				
				return { id, units};
			});

			let pageInfo = {
				title: tag.name,
				breadcrumbs: [
					{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
					{title:'Tags', url: '/tags/'},
					{title:tag.name, url: '/tag/'+ tag._id},
				],
				activeNavItem: 'Tags',
				jumbotronImageUrl:'https://www.patsnap.com/hubfs/Webinars/Guest%20speaker%20webinars%20/Roshan/Introduction%20to%20Markush/1519_Introduction-to-searching-using-Markush-structures-from-Patents_Header.jpg' 

			};	



			let	avatarUrl = getAvatarUrl(req);
			res.render('academy/tag.ejs', {user: req.user, results:results,  avatarUrl:avatarUrl, pageInfo: pageInfo, tag:tag});

		})
		.catch( (err) => { logger.error(err); });

};

exports.getTags = function(req,res){
	Tag.find({}).sort({name:1}).exec()
		.then((tags)=>{

			let pageInfo = {
				title: 'Tags',
				breadcrumbs: [
					{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
					{title:'Tags', url: '/tags/'},
				],
				activeNavItem: 'Tags',
				jumbotronImageUrl:'https://www.patsnap.com/hubfs/Webinars/Guest%20speaker%20webinars%20/Roshan/Introduction%20to%20Markush/1519_Introduction-to-searching-using-Markush-structures-from-Patents_Header.jpg' 

			};	

			let	avatarUrl = getAvatarUrl(req);
			res.render('academy/tags.ejs', {user: req.user, tags: tags,  avatarUrl:avatarUrl, pageInfo: pageInfo});

		})
		.catch( (err) => { logger.error(err); });

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
			let	avatarUrl = getAvatarUrl(req);
			res.render('academy/quiz.ejs', {user: req.user, pageInfo:pageInfo,course: course, unit: unit, avatarUrl:avatarUrl, quiz: JSON.stringify(quiz)});
		});

	});
};
