var User = require('../models/user');
var Course = require('../models/course');
var Quiz = require('../models/quiz');

// Courses

exports.getCourses = function(req,res){
	Course.find({}).sort({order:1}).exec(function(err, courses){
		if(err){
			console.log(err);
		}
		
		res.render('admin/courses.ejs', {user: req.user, courses: courses});
	});
};

exports.getCourse = function(req,res){
	Course.findOne({ _id: req.params.course_id}, function (err,course){
		if(err){
			console.log(err);
		}
		res.render('admin/course.ejs', {user: req.user, course: course});
	});
};


exports.getUnit = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);
		res.render('admin/unit.ejs', {user: req.user, course: course, unit: unit});
	});
};

exports.getModule = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);
		let module = unit.modules.filter( m => m._id == req.params.module_id);
		res.render('admin/module.ejs', {user: req.user, course: course, unit: unit, module: module[0] });

	});
};

// Quizzes 

exports.getQuizzes = function(req,res){
	Quiz.find({}, function(err, quizzes){
		if(err){
			console.log(err);
		}
		res.render('admin/quizzes.ejs', {user: req.user, quizzes: quizzes});
	});
};

exports.getQuiz = function(req,res){
	Quiz.findOne({ _id: req.params.quiz_id}, function (err, quiz){
		if(err){
			console.log(err);
		}
		res.render('admin/quiz.ejs', { user: req.user, quiz: quiz });
	});
};

exports.getQuestion = function(req,res){

	Quiz.findOne({ _id: req.params.quiz_id }, function(err, quiz){
		if(err){
			console.log(err);
		}

		var question = quiz.questions.id(req.params.question_id);
		res.render('admin/question.ejs', { user: req.user, quiz: quiz, question: question });
	});
};

// Users
exports.getUsers = function(req,res){
	User.find({}, function(err, users){
		if(err){
			console.log(err);
		}
		res.render('admin/users.ejs', {user:req.user, users:users});
	});
};

exports.getUser = function(req,res){
	User.findById({ _id: req.params.user_id }, function (err,user){
		if(err){
			console.log(err)
		}
		res.render('admin/user.ejs', {user: user});
	});
};
