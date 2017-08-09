const express = require('express');
const apiRouter = express.Router();
const router = express.Router();
const adminRouter = express.Router();
const courseController = require('./controllers/course-controller');
const userController = require('./controllers/user-controller');
const authController = require('./controllers/auth-controller');
const adminController = require('./controllers/admin-controller');
const quizController = require('./controllers/quiz-controller');

module.exports = function(app,passport){

	// Course Routes - API
	apiRouter.route('/courses')
		.get( courseController.getCourses)
		.post(authController.isLoggedIn, authController.isAdmin, courseController.postCourse);

	apiRouter.route('/courses/:course_id')
		.get(courseController.getCourse)
		.put(authController.isLoggedIn, authController.isAdmin, courseController.putCourse)
		.delete(authController.isLoggedIn, authController.isAdmin, courseController.deleteCourse);
		
	apiRouter.route('/courses/:course_id/units')
		.get(courseController.getCourseUnits)
		.post(authController.isLoggedIn, authController.isAdmin, courseController.postCourseUnit);

	apiRouter.route('/courses/:course_id/units/:unit_id')
		.get(courseController.getCourseUnit)
		.put(authController.isLoggedIn, authController.isAdmin, courseController.putCourseUnit)
		.delete(authController.isLoggedIn, authController.isAdmin, courseController.deleteCourseUnit);

	apiRouter.route('/courses/:course_id/units/:unit_id/modules')
		.get(courseController.getCourseUnitModules)
		.post(authController.isLoggedIn, authController.isAdmin, courseController.postCourseUnitModule);
	
	apiRouter.route('/courses/:course_id/units/:unit_id/modules/:module_id')
		.get(courseController.getCourseUnitModule)
		.put(authController.isLoggedIn, authController.isAdmin, courseController.putCourseUnitModule)
		.delete(authController.isLoggedIn, authController.isAdmin, courseController.deleteCourseUnitModule);

	// Quiz Routes
	apiRouter.route('/quizzes')
		.get(quizController.getQuizzes)
		.post(authController.isLoggedIn, authController.isAdmin, quizController.postQuiz);

	apiRouter.route('/quizzes/:quiz_id')
		.get(quizController.getQuiz)
		.delete(authController.isLoggedIn, authController.isAdmin, quizController.deleteQuiz);
	
	// User Routes

	router.route('/user')
		.get(authController.isAuthenticated, userController.getUser);

	apiRouter.route('/users')
		.get(authController.isAuthenticated, authController.isAdmin, userController.getUsers);

	apiRouter.route('/users/verify')
		.get(authController.isAuthenticated, userController.verifyUser);

	// admin Routes
	
	adminRouter.route('/')
		.get(authController.isLoggedIn, authController.isAdmin, function(req,res){
			res.render('admin/index.ejs', {user: req.user});
		});

	adminRouter.route('/login')
		.get(function(req,res){
			res.render('admin/login.ejs',{ message: req.flash('loginMessage')});
		})
		.post(passport.authenticate('local-login', {
			successRedirect:'/admin',
			failureRedirect:'/admin/login',
			failureFlash: true
		}));

	adminRouter.route('/users')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getUsers);

	adminRouter.route('/courses')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getCourses);


	adminRouter.route('/courses/:course_id')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getCourse);

	adminRouter.route('/courses/:course_id/units/:unit_id')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getUnit);

	adminRouter.route('/courses/:course_id/units/:unit_id/modules/:module_id')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getModule);

	adminRouter.route('/quizzes')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getQuizzes);

	adminRouter.route('/quizzes/:quiz_id')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getQuiz);
	
	//  Non API routers
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

	router.route('/')
		.get(function(req,res){
			res.render('index.ejs');
		});

	app.use('/', router);
	app.use('/api', apiRouter);
	app.use('/admin', adminRouter);

	// Handle 404
	app.use(function(req, res) {
		res.status(404).render('index.ejs');
	});
};