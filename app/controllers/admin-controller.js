//var User = require('../models/user');
var Course = require('../models/course');

//const passport = require('passport');

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


/*
exports.getUsers = function(req,res){
	User.find({}, function(err, users){
		if(err){
			console.log(err);
		}
		res.json({users});
	});
};

exports.getUser = function(req,res){
	// User.find({}, function(err, users){
	// 	if(err){
	// 		console.log(err);
	// 	}
	// 	res.json({users});
	// });
};

exports.verifyUser = function(req,res){
	console.log('User Verified');
	res.status(200).json({ message: 'Verified'});
};

*/

