var Quiz = require('../models/quiz');

exports.getQuizzes = function(req,res){
	Quiz.find({}, function(err, quizzes){
		if(err){
			console.log(err);
		}
		res.json({quizzes});
	});
};

exports.postQuiz = function(req,res){
	var quiz = new Quiz();
	quiz.name = req.body.name;
	quiz.save(function(err){
		if(err){
			console.log(err);
			res.status(400).json({message: 'Error adding Quiz'});
		} else {
			res.status(200).json({message: 'Quiz Added', data: quiz});
		}
	});
};


exports.putQuiz = function(req,res){
	Quiz.findById(req.params.quiz_id, function(err,quiz){
		if(err){
			console.log(err);
		}

		quiz.name = req.body.name || quiz.name;
		quiz.main = req.body.main|| quiz.main;
		quiz.results = req.body.results || quiz.results;
	
		quiz.save(function(err){
			if(err){
				console.log(err);
			}
			res.json(quiz);
		});

	});
};

exports.deleteQuiz = function(req,res){
	Quiz.remove({ _id: req.params.quiz_id }, function(err){
		if(err){
			console.log(err);
		}
		res.status(200).json({message: 'Deleted Quiz'});
	});
};

exports.getQuiz = function(req,res){
	Quiz.find({ _id: req.params.quiz_id}, function (err,quiz){
		if(err){
			console.log(err);
		}
		res.json(quiz);
	});
};

exports.postQuestion = function(req,res){
	var question = {
		q: req.body.q,
		correct: req.body.correct,
		incorrect: req.body.incorrect,
		a: req.body.a,
	};

	Quiz.findById(req.params.quiz_id, function(err,quiz){
		if(err){
			console.log(err);
		}

		quiz.questions.push(question);

		quiz.save(function(err){
			if(err){
				console.log(err);
			}

			res.status(200).json({message: 'Question Added', data: quiz });
		});
	});
};

exports.getQuestion = function(req,res){

	Quiz.findById(req.params.quiz_id, function(err, quiz){
		if(err){
			console.log(err);
		}

		var question = quiz.questions.id(req.params.question_id);
		res.status(200).json(question);
	});

};

exports.deleteQuestion = function(req,res){
	
	Quiz.findById(req.params.quiz_id, function(err, quiz){
		if(err){
			console.log(err);
			res.json({error: err});
		}
		
		if(quiz.questions.id(req.params.question_id) === null){
			console.log('deleteCourseUnit: Unit Not Found');
			res.json({message: 'deleteCourseUnit: Unit Not Found'});
		} else {
			quiz.questions.id(req.params.question_id).remove();

			quiz.save(function(err){
				if(err){
					console.log(err);
				}

				res.status(200).json({message: 'Question Deleted'});
			});
		}
	});
};

exports.putQuestion = function(req,res){
	Quiz.findById(req.params.quiz_id, function(err, quiz){

		if(err){
			console.log(err);
		}

		var question = quiz.questions.id(req.params.question_id);

		question.q = req.body.q || question.q;
		question.correct = req.body.correct || question.correct;
		question.incorrect = req.body.incorrect || question.incorrect;
		question.order = req.body.order || question.order;
		
		if(req.body.a){
			question.a = JSON.parse(req.body.a);
		}

		quiz.save(function(err){
			if(err){
				console.log(err);
			}

			res.json(question);
		});
	});
};