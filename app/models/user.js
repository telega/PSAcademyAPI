const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bcrypt   = require('bcrypt-nodejs');
mongoose.Promise = bluebird;

var academyProgressSchema = mongoose.Schema({
	itemId : String,
	itemProgress : {
		type: Number,
		default: 0
	},
	itemCompleted: {
		type: Boolean,
		default: false
	}
});

var academyBadgesSchema = mongoose.Schema({
	name: String,
	value: {
		type: Boolean,
		default: false
	}
});

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
			firstName: { 
				type: String,
				default:'User' 
			},
			lastName: { 
				type: String, 
				default:''
			}
		},
		role		: {
			type: String,
			enum: ['Member','Admin'],
			default: 'Member'
		},
		academyProgress: [academyProgressSchema],
		academyBadges: [academyBadgesSchema]
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date
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