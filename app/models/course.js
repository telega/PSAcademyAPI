const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;

var ModuleSchema = new Schema({
	name: {type: String, required: true},
	description: String,
	length: {type: Number},
	type: {
		type: String,
		enum: ['Quiz', 'Video'],
		default:'Video'
	},
	resources: [{
		title : String,
		url : String
	}],
});

var UnitSchema = new Schema({
	name: {type: String, required: true},
	description: String,
	published: {
		type: Boolean,
		default: false
	},
	order: Number,
	modules: [ModuleSchema],
});

var CourseSchema = new Schema({
	name: {type: String, unique: true, required: true},
	description: String,
	published: {
		type: Boolean,
		default: false
	},
	order: Number,
	units: [UnitSchema],
});

module.exports = mongoose.model('Course', CourseSchema);