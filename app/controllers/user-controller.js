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


// function updateUnitProgress(id){
// 	console.log(id);

// 	Course.findOne({'units': { $elemMatch: {'field': '_id', 'value': id} } }, function(err,course){
// 		if(err){
// 			console.log(err);
// 		}
// 		// var unit = course.units.id(req.params.unit_id);

// 		console.log(course);
// 	});

// }

// exports.putCourseProgress = function(req,res){

// 	User.findById(req.user._id, function(err,user){
// 		if(err){
// 			console.log(err);
// 		}
		
// 		let items = user.local.academyProgress.filter( m => m.itemId == req.body.itemId);

// 		if(items.length == 0){
// 			var academyProgress = {
// 				itemId: req.body.itemId,
// 				itemProgress: parseFloat(req.body.itemProgress) || 0,
// 				itemCompleted: req.body.itemCompleted || false
// 			};
// 			user.local.academyProgress.push(academyProgress);
// 		} else {
// 			for(i in items){
// 				items[i].itemProgress = items[i].itemProgress + parseFloat(req.body.itemProgress);
// 				if(items[i].itemProgress >= 100){
// 					items[i].itemCompleted = true;
// 					items[i].itemProgress = 100;					
// 				}else{
// 					items[i].itemCompleted = false;
// 				}
// 			}
// 		}

// 		updateUnitProgress(req.body.unitId);

// 		user.save(function(err){
// 			if(err){
// 				console.log(err);
// 			}
// 			res.status(200).json({message: 'Progress Updated'});
// 		});
// 	});

// };

exports.verifyUser = function(req,res){
	console.log('User Verified');
	res.status(200).json({ message: 'Verified'});
};