var User = require('../models/user');
//const passport = require('passport');

exports.postUser = function(req,res){
	var user = new User();	
};

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