const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;

var AcademySchema = new Schema({
	academyIntroText: {
		type: String,
		default:'Welcome to Academy by PatSnap'
	},
	academyNewsHeadline:{
		type: String,
		default: 'Latest News Headline'
	},
	academyNewsText: {
		type:String,
		default: 'Latest News Item'
	},
});

module.exports = mongoose.model('Academy', AcademySchema);