const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;

var QuestionSchema = new Schema({
	q: String,
	a:[{
		option: {type: String, required: true},
		correct: {type: Boolean, default: false}
	}],
	correct: String,
	incorrect: String,
	select_any: {type: Boolean, default: false},
});

var QuizSchema = new Schema({
	name: {type: String, unique: true, required: true},
	referenceNumber: {type: Number, unique: true, required: true},
	main: String,
	results: String,
	questions: [QuestionSchema],
});

module.exports = mongoose.model('Quiz', QuizSchema);