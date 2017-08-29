const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;

var ModuleSchema = new Schema({
	name: {type: String, required: true},
	description: String,
	length: {type: Number},
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

var UnitSchema = new Schema({
	name: {type: String, required: true},
	description: String,
	published: {
		type: Boolean,
		default: false
	},
	order: Number,
	modules: [ModuleSchema],
	unitImageUrl:{
		type: String,
		default:'https://www.patsnap.com/hubfs/Academy/Images/psa_course_default.jpg'
	},
	unitThumbImageUrl:{
		type: String,
		default:'https://www.patsnap.com/hubfs/Academy/Images/psa_course_default_thumb.jpg'
	},
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
	courseImageUrl:{
		type: String,
		default:'https://www.patsnap.com/hubfs/Academy/Images/psa_course_default.jpg'
	},
	courseThumbImageUrl:{
		type: String,
		default:'https://www.patsnap.com/hubfs/Academy/Images/psa_course_default_thumb.jpg'
	},
});

module.exports = mongoose.model('Course', CourseSchema);