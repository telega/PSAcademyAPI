const express = require('express');
const apiRouter = express.Router();
const router = express.Router();
const adminRouter = express.Router();
const courseController = require('./controllers/course-controller');
const userController = require('./controllers/user-controller');
const authController = require('./controllers/auth-controller');
const adminController = require('./controllers/admin-controller');
const quizController = require('./controllers/quiz-controller');
const academyController = require('./controllers/academy-controller');

module.exports = function(app,passport){

	// Course Routes - API
	apiRouter.route('/courses')
		.get(courseController.getCourses)
		.post(authController.isLoggedIn, authController.isAdmin, courseController.validatePostCourse, courseController.postCourse);

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
		.get(authController.isLoggedIn, quizController.getQuizzes)
		.post(authController.isLoggedIn, authController.isAdmin, quizController.postQuiz);

	apiRouter.route('/quizzes/:quiz_id')
		.get(authController.isLoggedIn,quizController.getQuiz)
		.put(authController.isLoggedIn, authController.isAdmin, quizController.putQuiz)
		.delete(authController.isLoggedIn, authController.isAdmin, quizController.deleteQuiz);

	apiRouter.route('/quizzes/:quiz_id/questions')
		.post(authController.isLoggedIn, authController.isAdmin, quizController.postQuestion);

	apiRouter.route('/quizzes/:quiz_id/questions/:question_id')
		.get(quizController.getQuestion)
		.put(authController.isLoggedIn, authController.isAdmin, quizController.putQuestion)
		.delete(authController.isLoggedIn, authController.isAdmin, quizController.deleteQuestion);
	
	// User Routes

	apiRouter.route('/users')
		.get(authController.isAuthenticated, authController.isAdmin, userController.getUsers);

	// apiRouter.route('/users/verify')
	// 	.get(authController.isAuthenticated, userController.verifyUser);

	apiRouter.route('/users/:user_id')
		.put(authController.isLoggedIn, authController.isAdmin, userController.putUser)
		.delete(authController.isLoggedIn, authController.isAdmin, userController.deleteUser);

	apiRouter.route('/progress/:user_id/courses/:course_id/units/:unit_id/modules/:module_id')
		.put(authController.isLoggedIn, userController.validatePutModuleProgress, userController.putModuleProgress);

	apiRouter.route('/progress/:user_id/courses/:course_id')
		.put(authController.isLoggedIn, userController.validateAddCourseToUser, userController.addCourseToUser);

	apiRouter.route('/progress/:user_id/courses/:course_id/units/:unit_id')
		.get(authController.isLoggedIn, userController.validateGetUnitProgress, userController.getUnitProgress);

	// admin Routes
	
	adminRouter.route('/')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getAdminPage);

	adminRouter.route('/login')
		.get(function(req,res){
			let pageInfo = {
				title: 'Login'
			};
			res.render('admin/login.ejs',{ message: req.flash('loginMessage'), page: pageInfo});
		})
		.post(passport.authenticate('local-login', {
			successRedirect:'/admin',
			failureRedirect:'/admin/login',
			failureFlash: true
		}));

	adminRouter.route('/academy')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getAcademyOptions)
		.put(authController.isLoggedIn, authController.isAdmin, adminController.putAcademyOptions);

	adminRouter.route('/users')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getUsers);

	adminRouter.route('/users/:user_id')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getUser);

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

	adminRouter.route('/quizzes/:quiz_id/questions/:question_id')
		.get(authController.isLoggedIn, authController.isAdmin, adminController.getQuestion);
	
	//  Non API routers
	router.route('/signup')
		.post(passport.authenticate('local-signup',{
			successRedirect: '/',
			failureRedirect: '/',
			failureFlash: true
		}));

	router.route('/login')
		.get(academyController.getLogin)
		.post(passport.authenticate('local-login', {
			successRedirect:'/',
			failureRedirect:'/',
			failureFlash: true
		}));

	router.route('/forgot')
		.get(userController.getForgot)
		.post(userController.postForgot);

	router.route('/password')
		.get(userController.getPasswordSetup)
		.post(userController.postPasswordSetup);

	router.route('/reset/:token')
		.get(userController.getReset)
		.post(userController.postReset);

	router.route('/glossary')
		.get(authController.isLoggedIn, academyController.getGlossary);

	router.route('/courses')
		.get(authController.isLoggedIn, academyController.getCourses);

	router.route('/courses/:course_id')
		.get(authController.isLoggedIn, academyController.getCourse);

	router.route('/courses/:course_id/units/:unit_id')
		.get(authController.isLoggedIn, academyController.getCourseUnit);

	router.route('/courses/:course_id/units/:unit_id/quiz/:quiz_id')
		.get(authController.isLoggedIn, academyController.getQuiz);

	router.route('/profile')
		.get(authController.isLoggedIn, academyController.getProfile);
	
	router.route('/profile/:user_id')
		.put(authController.isLoggedIn, authController.validatePutProfile, academyController.putProfile);
	
	router.route('/logout')
		.get(authController.logOut);

	router.route('/')
		.get(academyController.getHomepage);

	app.use('/', router);
	app.use('/api', apiRouter);
	app.use('/admin', adminRouter);

	// Handle 404
	app.use(function(req, res) {
		res.status(404).render('404.ejs');
	});
};