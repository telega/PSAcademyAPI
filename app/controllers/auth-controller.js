//const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
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
		console.log('isAdmin: Unauthorized API credentials')
		//res.status(401).json({error: 'Unauthorized API credentials'});
		res.status(401).redirect('/admin/login');
	});
};

exports.logOut = function(req,res){
	req.logout();
	res.redirect('/');
};

passport.use(new BasicStrategy(
	function(email, password, next){
		User.findOne({ 'local.email' :  email }, function(err, user) {
		// if there are any errors, return the error before anything else
			if (err){
				return done(err);
			}
			// if no user is found, return the message
			if (!user){
				return next(null, false); 
			}
			// if the user is found but the password is wrong
			if (password !== user.local.password){
				return next(null, false); 
			}

			// all is well, return successful user
			return next(null, user);
		});
	}
));

exports.isAuthenticated = passport.authenticate('basic', { session: false});