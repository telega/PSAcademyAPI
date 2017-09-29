//const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
//const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../models/user.js');
const { check, validationResult } = require('express-validator/check');
const logger = require('../logger');



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
		logger.warn('Unauthorized API credentials: Not Admin');
		//res.status(401).json({error: 'Unauthorized API credentials'});
		res.status(401).redirect('/admin/login');
	});
};

exports.logOut = function(req,res){
	req.logout();
	res.redirect('/');
};

exports.validatePutProfile = [
	check('user_id').exists().isAlphanumeric().withMessage('Must exist and be an integer'),
	function (req,res,next){
		let errors = validationResult(req);

		if( !errors.isEmpty() ){
			logger.debug('validatePutProfile FAIL')
			res.status(422).json({message: errors.mapped()});
		} 
		if(req.params.user_id !== req.user._id.toString()){
			logger.warn('validatePutProfile: Not Authorised')
			res.status(401).json({message:'Not Authorised to update this user.'});
		}
		else {
			next();
		}
	}
];

exports.isAuthenticated = passport.authenticate('basic', { session: false});