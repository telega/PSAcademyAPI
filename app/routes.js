const express = require('express');
const router = express.Router();
const courseController = require('./controllers/course-controller');
const userController = require('./controllers/user-controller');
const authController = require('./controllers/auth-controller');

module.exports = function(app,passport){
	// API Routes
	router.use(function(req,res,next){
		console.log('Request Recieved');
		next();
	});

	router.route('/courses')
		.post(courseController.postCourse)
		.get(authController.isAdmin, courseController.getCourses);

	router.route('/courses/:course_id')
		.get(courseController.getCourse)
		.put(courseController.putCourse);

	router.route('/courses/:course_id/units')
		.get(courseController.getCourseUnits)
		.post(courseController.postCourseUnit);

	router.route('/courses/:course_id/units/:unit_id')
		.get(courseController.getCourseUnit)
		.put(courseController.putCourseUnit);

	router.route('/courses/:course_id/units/:unit_id/modules')
		.get(courseController.getCourseUnitModules)
		.post(courseController.postCourseUnitModule);

	router.route('/courses/:course_id/units/:unit_id/modules/:module_id')
		.get(courseController.getCourseUnitModule)
		.put(courseController.putCourseUnitModule);

	router.route('/signup')
		.post(passport.authenticate('local-signup',{
			successRedirect: '/api/courses',
			failureRedirect: '/api/courses',
			failureFlash: true
		}));

	router.route('/login')
		.post(passport.authenticate('local-login', {
			successRedirect:'/api/courses',
			failureRedirect:'/',
			failureFlash: true

		}))

	router.get('/', function (req,res){
		res.json({message: 'welcome'});
	});

	// non API route
	app.get('/',function(req,res){
		res.send('hello');
	});

	app.use('/api',router);
};