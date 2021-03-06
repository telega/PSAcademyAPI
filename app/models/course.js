const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;
const Unit = require('./unit');
const UnitSchema = Unit.schema;

var CourseSchema = new Schema({
	name: {type: String, unique: true, required: true},
	description: String,
	published: {
		type: Boolean,
		default: false
	},
	type: {
		type: String,
		default:'Course'
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