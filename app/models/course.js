const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;

var ResourceSchema = new Schema({
	title: {type: String, required: true},
	url: String
});

var ModuleSchema = new Schema({
	name: {type: String, required: true},
	description: String,
	length: {type: Number},
	type: {type: String},
	resources: [ResourceSchema],
});

var UnitSchema = new Schema({
	name: {type: String, required: true},
	description: String,
	order: Number,
	modules: [ModuleSchema],
});

var CourseSchema = new Schema({
		name: {type: String, unique: true, required: true},
		description: String,
		order: Number,
		units: [UnitSchema],
});

module.exports = mongoose.model('Course', CourseSchema);