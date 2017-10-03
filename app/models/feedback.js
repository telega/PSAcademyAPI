const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;

var FeedbackSchema = new Schema({
	title: {type: String, required: true},
	description: String,
	published: {
		type: Boolean,
		default: true
	},
	userVotes: {type: Array, default: []},
	suggestedBy: {type: String, default:'Anonymous'},
	suggestedByEmail: {type: String, default: 'academy@patsnap.com'}
});

module.exports = mongoose.model('Feedback', FeedbackSchema);