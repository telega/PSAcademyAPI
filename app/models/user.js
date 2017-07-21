const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bcrypt   = require('bcrypt-nodejs');
mongoose.Promise = bluebird;

var userSchema = mongoose.Schema({

	local			: {
		email		: {
			type: String,
			unique: true,
			required: true
		},
		password	: {
			type: String,
			required: true
		},
		profile		: {
			firstName: { type: String },
			lastName: { type: String }
		},
		role		: {
			type: String,
			enum: ['Member','Admin'],
			default: 'Member'
		}
	}
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);