const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bcrypt   = require('bcrypt-nodejs');
const uniqueValidator = require('mongoose-unique-validator');
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
				default:'Name'
			},
			userName: {
				type: String,
				unique: true
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
		},
		academyRank: {
			type: Number,
			default: 0
		}
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

userSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });

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

	let academyProgress = this.local.academyProgress.reduce((filtered, progressItem )=>{
		let academyItem = flatCourses.find(function(e){
			return e.id.toString() == progressItem.itemId;
		});
		
		// remove item if course longer exists (eg course has been removed since user completed it)
		if((typeof(academyItem) != 'undefined')){
			progressItem.itemType = academyItem.itemType;
			progressItem.relatedItem = academyItem.id;
			filtered.push(progressItem);
		}
		
		return filtered;
	} , []);

	return academyProgress;

	
};


userSchema.methods.updateUserAcademyScore = function(){

	let videos = this.local.academyProgress.filter((pi)=>{
		return ((pi.itemCompleted == true) && (pi.itemType == 'Video'));
	});
	let quizes =  this.local.academyProgress.filter((pi)=>{
		return ((pi.itemCompleted == true) && (pi.itemType == 'Quiz'));
	});

	let courses = this.local.academyProgress.filter((pi)=>{
		return ((pi.itemCompleted == true) && (pi.itemType == 'Course'));
	});

	let units = this.local.academyProgress.filter((pi)=>{
		return ((pi.itemCompleted == true) && (pi.itemType == 'Unit'));
	});
	let score = videos.length + quizes.length + (3 * units.length) + (2 * courses.length);	
	return score;
};



// userSchema.methods.updateUserAcademyScore = function(){

// 	let score = this.local.academyProgress.filter((progressItem)=>{
// 		return progressItem.itemCompleted == true;
// 	}).map((element)=>{
// 		switch(element.itemType){
// 		case 'Video':
// 			return 1;
// 		case 'Quiz':
// 			return 1;   
// 		case 'Unit':
// 			return 3;
// 		case 'Course':
// 			return 2;
// 		default:
// 			return 0;
// 		}
		
// 	}).reduce((accumulator, element)=>{
// 		return accumulator + element;
// 	},0);
	
// 	return score;
// };

// userSchema.methods.updateUserAcademyScore = function(){

// 	let score = this.local.academyProgress.filter((progressItem)=>{
// 		return progressItem.itemCompleted == true;
// 	}).reduce((accumulator, progressItem)=>{
// 		if(progressItem.itemType == 'Video'){
// 			accumulator +=1;
// 		}
// 		if(progressItem.itemType == 'Quiz'){
// 			accumulator += 1;
// 		}
// 		if(progressItem.itemType == 'Unit'){
// 			accumulator += 3;
// 		}
// 		if(progressItem.itemType == 'Course'){
// 			accumulator += 2;
// 		}
// 	},0);

// 	return score;
// };


// userSchema.methods.updateUserAcademyScore = function(){

// 	let score = 0;
// 	this.local.academyProgress.forEach(function(progressItem){
// 		if(progressItem.itemCompleted){
// 			if(progressItem.itemType == 'Video'){
// 				score +=1;
// 			}
// 			if(progressItem.itemType == 'Quiz'){
// 				score += 1;
// 			}
// 			if(progressItem.itemType == 'Unit'){
// 				score += 3;
// 			}
// 			if(progressItem.itemType == 'Course'){
// 				score += 2;
// 			}
// 		}
// 	});
// 	return score;
// };


userSchema.methods.updateAcademyRank = function(users){

	if(this.local.role == 'Admin'){
		return 0;
	}

	let score = this.local.academyScore;
	let pointsList = users.filter((user)=>{ 
		return user.local.role != 'Admin';
	}).map((user)=>{
		return user.local.academyScore;
	}).filter((elem,index,array)=>{
		return array.indexOf(elem) === index;
	}).sort().reverse();

	return pointsList.indexOf(score)+1;

};


// userSchema.methods.updateAcademyRank = function(users){
// 	let userId = this._id;
// 	let rank = 0;
// 	let userRank = 0;
// 	let previousScore = 0;

// 	if(this.local.role != 'Admin'){
// 		users.forEach(function(user){
// 			if(user.local.role != 'Admin'){
// 				if(user.local.academyScore != previousScore){
// 					previousScore = user.local.academyScore;
// 					rank ++;
// 				}

// 				if(userId.equals(user._id)){
// 					userRank = rank;
// 				}
// 			}
// 		});
// 	}
// 	return userRank;
// };

// generates username and checks it is unique
function makeUserName(fn,ln,users){
	let userName = '' + fn + ln + Math.floor(Math.random()*1000);
	let isUnique = true;
	users.forEach((user) => {
		if(user.local.profile.userName == userName){
			isUnique = false;
		}
	});	
	if (isUnique == true){
		return userName;
	} else {
		return makeUserName(fn,ln,users);
	}
}

userSchema.methods.generateUserName = function(){

	let firstInitial = this.local.profile.firstName.slice(0,1).toLowerCase();
	let lastInitial = this.local.profile.lastName.slice(0,1).toLowerCase();

	return User.find({}).exec()
		.then((users) => {	
			return makeUserName(firstInitial,lastInitial,users);
		});

};

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};


// create the model for users and expose it to our app
var User = mongoose.model('User', userSchema);

module.exports = User;
