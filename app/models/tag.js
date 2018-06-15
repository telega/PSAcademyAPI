const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;
const Course = require('./course');

var UnitTagReferenceSchema = new Schema({
	unit: { type: Schema.Types.ObjectId},
	parentCourse: {type: Schema.Types.ObjectId, ref: 'Course' },
});

var TagSchema = new Schema({
	name: {type: String, required: true},
	courses:[{ type: Schema.Types.ObjectId, ref: 'Course' }],
	units:[UnitTagReferenceSchema],
});

module.exports = mongoose.model('Tag', TagSchema);