const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;

var ModuleSchema = new Schema({
	name: {type: String, required: true},
	description: String,
	length: {
		type: Number,
		default: 1
	},
	order: Number,
	type: {
		type: String,
		enum: ['Quiz', 'Video'],
		default:'Video'
	},
	resources: [{
		title : String,
		url : String
	}],
	contentId: {
		type: String,
		default: '226295792'
	},
});

module.exports = mongoose.model('Module', ModuleSchema);