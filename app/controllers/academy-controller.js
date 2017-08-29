var Course = require('../models/course');
var Quiz = require('../models/quiz');


exports.getCourses = function(req,res){
	Course.find({}, function(err, courses){
		if(err){
			console.log(err);
		}
		res.render('academy/courses.ejs', {user: req.user, courses: courses});
	});
};

exports.getCourse = function(req,res){
	Course.findById(req.params.course_id, function (err,course){
		if(err){
			console.log(err);
		}
		res.render('academy/course.ejs', {user: req.user, course: course});
	});
};


// exports.getCourseUnits = function(req,res){
// 	Course.findById(req.params.course_id, function(err,course){
// 		if(err){
// 			console.log(err);
// 		}

// 		res.json(course.units);
// 	});
// };

exports.getCourseUnit = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);
		res.render('academy/unit.ejs', {user: req.user, course: course, unit: unit});
	});
};


exports.getQuiz = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}

		Quiz.findById({ _id: req.params.quiz_id}, function (err,quiz){
			if(err){
				console.log(err);
			}

			var unit = course.units.id(req.params.unit_id);
			res.render('academy/quiz.ejs', {user: req.user, course: course, unit: unit, quiz: JSON.stringify(quiz)});
		});

	});
};