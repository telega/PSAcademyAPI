//const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');

exports.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
};

exports.isAdmin= function(req,res,next) {  
	const user = req.user;
	User.findById(user._id, function(err, foundUser) {
		if (err) {
			res.status(422).json({ error: 'No user was found.' });
			return next(err);
		}
		// If user is found, check role.
		if (foundUser.local.role == 'Admin') {
			return next();
		}
		res.redirect('/');
	});
};