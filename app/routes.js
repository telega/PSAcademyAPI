const express = require('express');
const apiRouter = express.Router();
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

	// Course Routes

	apiRouter.route('/courses')
		.get(authController.isAuthenticated,courseController.getCourses)
		.post(authController.isLoggedIn, authController.isAdmin, courseController.postCourse);

	apiRouter.route('/courses/:course_id')
		.get(courseController.getCourse)
		.put(authController.isLoggedIn, authController.isAdmin, courseController.putCourse)
		.delete(authController.isLoggedIn, authController.isAdmin, courseController.deleteCourse);
		
	apiRouter.route('/courses/:course_id/units')
		.get(authController.isLoggedIn, courseController.getCourseUnits)
		.post(authController.isLoggedIn, authController.isAdmin, courseController.postCourseUnit);

	apiRouter.route('/courses/:course_id/units/:unit_id')
		.get(authController.isLoggedIn, courseController.getCourseUnit)
		.put(authController.isLoggedIn, authController.isAdmin, courseController.putCourseUnit);

	apiRouter.route('/courses/:course_id/units/:unit_id/modules')
		.get(authController.isLoggedIn, courseController.getCourseUnitModules)
		.post(authController.isLoggedIn, authController.isAdmin, courseController.postCourseUnitModule);

	apiRouter.route('/courses/:course_id/units/:unit_id/modules/:module_id')
		.get(authController.isLoggedIn, courseController.getCourseUnitModule)
		.put(authController.isLoggedIn, authController.isAdmin, courseController.putCourseUnitModule);

	// User Routes

	router.route('/user')
		.get(authController.isLoggedIn, userController.getUser);

	apiRouter.route('/users')
		.get(authController.isLoggedIn, authController.isAdmin,userController.getUsers);

	// Passport (Auth) Routes
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

		}));

	router.get('/', function (req,res){
		res.json({message: 'welcome'});
	});

	// non API route
	app.get('/',function(req,res){
		res.send('hello');
	});
	app.use('/', router);
	app.use('/api',apiRouter);
};