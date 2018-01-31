const passport = require('passport');
const freemail = require('freemail');
const User = require('../app/models/user');
const Course = require('../app/models/course');
const LocalStrategy = require('passport-local').Strategy;
const hsPortalId = process.env.HS_PORTAL_ID || null;
const hsFormID = process.env.HS_FORM_ID || null;
const https = require('https');
const querystring = require('querystring');
const logger = require('../app/logger');

module.exports = function(passport){
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true 
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			//check it isnt a freemail address.
			if( (freemail.isFree(email)) ||(freemail.isDisposable(email))){
				return done(null, false, req.flash('loginMessage', 'Sorry, but free email providers are not allowed. Please us another email address.'));
			}else{

			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
				User.findOne({ 'local.email' :  email }, function(err, user) {
					if (err){
						return done(err);
					}
					// check to see if theres user exists
					if (user) {
						return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
					} else {

						logger.info('New User Signup: ' + email );

						// HS Request
						if(hsPortalId && hsFormID) {
	
							var postData = querystring.stringify({
								'email': email,
								'firstname': req.body.firstname,
								'lastname': req.body.lastname,
								'hs_context': JSON.stringify({
									"ipAddress": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
									"pageName": "Academy by PatSnap"
								})
							});
							
							// set the post options, changing out the HUB ID and FORM GUID variables.
							
							var options = {
								hostname: 'forms.hubspot.com',
								path: '/uploads/form/v2/'+ hsPortalId + '/' + hsFormID,
								method: 'POST',
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded',
									'Content-Length': postData.length
								}
							};
							
							// set up the request
							
							var request = https.request(options, function(response){
								logger.info("HS Form Status: " + response.statusCode);
								logger.debug("HS FormHeaders: " + JSON.stringify(response.headers));
								response.setEncoding('utf8');
								response.on('data', function(chunk){
									logger.silly('Body: ' + chunk)
								});
							});
							
							request.on('error', function(e){
								logger.warn("Problem with HS form request " + e.message)
							});
							
							// post the data
							
							request.write(postData);
							request.end();
	
						}
	
						// end HS Request


						// create the user
						var newUser	= new User();
	
						newUser.local.email	= email;
						newUser.local.password = newUser.generateHash(password);
						newUser.local.profile.firstName = req.body.firstname;
						newUser.local.profile.lastName = req.body.lastname;
						newUser.local.profile.userName = newUser.generateUserName();
		
						newUser.generateUserName().then((un) =>{
							newUser.local.profile.userName = un;
	
							newUser.save(function(err) {
								if (err){
									throw err;
								}
		
								return done(null, newUser);
							});
						});
					}
				});   
		
			}
		});

	}));


	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) { // callback with email and password from our form
		
		//check if we have to return to a page anchor
		if(req.body.hashCode && req.session.returnTo){
			req.session.returnTo = req.session.returnTo+req.body.hashCode;
		}

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		User.findOne({ 'local.email' :  email }, function(err, user) {
		// if there are any errors, return the error before anything else
			if (err){
				return done(err);
			}
			// if no user is found, return the message
			if (!user){
				return done(null, false, req.flash('loginMessage', 'No Academy user is registered with this email.')); // req.flash is the way to set flashdata using connect-flash
			}
			// if the user is found but the password is wrong
			if (!user.validPassword(password)){
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
			}
			// all is well, return successful user
			logger.info('User ' + user.local.email + ' logged into Academy' );
			
			// refresh user scores & check academy progress 

			Course.find({}).exec()
				.then((courses)=>{
					user.checkAcademyProgressItems(courses);
					user.local.academyScore = user.updateUserAcademyScore();	
					return user.save();
				}).then(()=>{
					return done(null, user);
				})
				.catch((err)=>{
					logger.error(err);
				});

		});
	}));

};
