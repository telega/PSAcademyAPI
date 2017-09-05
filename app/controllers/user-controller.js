var User = require('../models/user');
var Course = require('../models/course');
//const passport = require('passport');

exports.postUser = function(req,res){
	var user = new User();
	res.status(200);	
};

exports.getUsers = function(req,res){
	User.find({}, function(err, users){
		if(err){
			console.log(err);
		}
		res.json({users});
	});
};

// exports.getUser = function(req,res){
// 	// User.find({}, function(err, users){
// 	// 	if(err){
// 	// 		console.log(err);
// 	// 	}
// 	// 	res.json({users});
// 	// });
// };

exports.putUser = function(req,res){
	User.findById(req.params.user_id, function(err, user){
		if(err){
			console.log(err);
		}

		user.local.profile.firstName = req.body.firstName || user.local.profile.firstName;
		user.local.profile.lastName = req.body.lastName || user.local.profile.lastName;

		user.save(function(err){
			if(err){
				console.log(err);
			}
			res.status(200).json({message: 'User Updated'});
		});
	});
};


exports.deleteUser = function(req,res){
	User.remove({ _id: req.params.user_id }, function(err){
		if(err){
			console.log(err);
		}
		res.status(200).json({message: 'User Deleted'});
	});
};

exports.verifyUser = function(req,res){
	console.log('User Verified');
	res.status(200).json({ message: 'Verified'});
};