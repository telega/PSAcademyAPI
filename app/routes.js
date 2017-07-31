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
		.get( courseController.getCourses)
		.post(authController.isAuthenticated, authController.isAdmin, courseController.postCourse);

	apiRouter.route('/courses/:course_id')
		.get(courseController.getCourse)
		.put(authController.isAuthenticated, authController.isAdmin, courseController.putCourse)
		.delete(authController.isAuthenticated, authController.isAdmin, courseController.deleteCourse);
		
	apiRouter.route('/courses/:course_id/units')
		.get(courseController.getCourseUnits)
		.post(authController.isAuthenticated, authController.isAdmin, courseController.postCourseUnit);

	apiRouter.route('/courses/:course_id/units/:unit_id')
		.get(courseController.getCourseUnit)
		.put(authController.isAuthenticated, authController.isAdmin, courseController.putCourseUnit)
		.delete(authController.isAuthenticated, authController.isAdmin, courseController.deleteCourseUnit);

	apiRouter.route('/courses/:course_id/units/:unit_id/modules')
		.get(courseController.getCourseUnitModules)
		.post(authController.isAuthenticated, authController.isAdmin, courseController.postCourseUnitModule);
	
	apiRouter.route('/courses/:course_id/units/:unit_id/modules/:module_id')
		.get(courseController.getCourseUnitModule)
		.put(authController.isAuthenticated, authController.isAdmin, courseController.putCourseUnitModule)
		.delete(authController.isAuthenticated, authController.isAdmin, courseController.deleteCourseUnitModule);
	
	// User Routes

	router.route('/user')
		.get(authController.isAuthenticated, userController.getUser);

	apiRouter.route('/users')
		.get(authController.isAuthenticated, authController.isAdmin, userController.getUsers);

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
		res.json({message: 'PSAcademy API'});
	});

	// non API route
	app.get('/',function(req,res){
		res.send('hello');
	});
	app.use('/', router);
	app.use('/api',apiRouter);
};