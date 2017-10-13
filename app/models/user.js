const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bcrypt   = require('bcrypt-nodejs');
mongoose.Promise = bluebird;

var academyProgressSchema = mongoose.Schema({
	itemId : String,
	relatedItem:[{ type: mongoose.Schema.Types.ObjectId }],
	itemType: String, 
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
		academyBadges: [academyBadgesSchema],
		academyScore: {
			type: Number,
			default: 0
		}
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date
});


function flattenCourses(courses){
	let flat = [];

	courses.forEach(function(course){
		course.units.forEach(function(unit){
			unit.modules.forEach(function(module){
				flat.push({
					id: module._id,
					itemType: module.type
				});
			});
			flat.push({
				id: unit._id,
				itemType: unit.type
			});
		});
		flat.push({
			id: course._id,
			itemType: course.type
		});
	});

	return flat;
}

userSchema.methods.checkAcademyProgressItems = function(courses){

	let flatCourses = flattenCourses(courses);

	this.local.academyProgress.forEach(function(progressItem){
		let academyItem = flatCourses.find(function(e){
			return e.id.toString() == progressItem.itemId;
		});
		progressItem.itemType = academyItem.itemType;
		progressItem.relatedItem = academyItem.id;
	});

	return this.local.academyProgress;
};

userSchema.methods.updateUserAcademyScore = function(){
	let score = 0;
	this.local.academyProgress.forEach(function(progressItem){
		if(progressItem.itemCompleted){
			if(progressItem.itemType == 'Video'){
				score +=1;
			}
			if(progressItem.itemType == 'Quiz'){
				score += 1;
			}
			if(progressItem.itemType == 'Unit'){
				score += 3;
			}
			if(progressItem.itemType == 'Course'){
				score += 2;
			}
		}
	});
	return score;
};

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);