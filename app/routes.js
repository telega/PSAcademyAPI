const express = require('express');
const router = express.Router();
const courseController = require('./controllers/course-controller');

module.exports = function(app,passport){
	// API Routes
	router.use(function(req,res,next){
		console.log('Request Recieved');
		next();
	});

	router.route('/courses')
		.post(courseController.postCourse)
		.get(courseController.getCourses)

	router.route('/courses/:course_id')
		.get(courseController.getCourse)
		.put(courseController.putCourse)

	router.route('/courses/:course_id/units')
		.get(courseController.getCourseUnits)
		.post(courseController.postCourseUnit)

	router.route('/courses/:course_id/units/:unit_id')
		.get(courseController.getCourseUnit)
		.put(courseController.putCourseUnit)

	router.get('/', function (req,res){
		res.json({message: 'welcome'});
	});

	// non API route
	app.get('/',function(req,res){
		res.send('hello');
	})

	app.use('/api',router)
}