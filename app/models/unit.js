const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;
const Module = require('./module');
const ModuleSchema = Module.schema;

var UnitSchema = new Schema({
	name: {type: String, required: true},
	description: String,
	published: {
		type: Boolean,
		default: false
	},
	order: Number,
	type:{
		type: String,
		default:'Unit'
	},
	modules: [ModuleSchema],
	unitImageUrl:{
		type: String,
		default:'https://www.patsnap.com/hubfs/Academy/Images/psa_course_default.jpg'
	},
	unitThumbImageUrl:{
		type: String,
		default:'https://www.patsnap.com/hubfs/Academy/Images/psa_course_default_thumb.jpg'
	},
	tags:[String],
});

module.exports = mongoose.model('Unit', UnitSchema);