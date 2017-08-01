var User = require('../models/user');
var Course = require('../models/course');

//const passport = require('passport');

exports.getCourses = function(req,res){
	//var user = new User();	

	Course.find({}, function(err, courses){
		if(err){
			console.log(err);
		}
		
		res.render('admin/courses.ejs', {user: req.user, courses: courses});
		//res.json({courses});
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

