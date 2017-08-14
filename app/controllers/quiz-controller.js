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

/*
exports.putCourse = function(req,res){
	Course.findById(req.params.course_id, function(err, course){
		if(err){
			console.log(err);
		}
		course.name = req.body.name || course.name;
		course.description = req.body.description || course.description;
		course.order = req.body.order || course.order;
		course.published = req.body.published || course.published;

		course.save(function(err){
			if(err){
				console.log(err);
			}
			res.json(course);
		});
	});
};



exports.getCourseUnits = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}

		res.json(course.units);
	});
};

exports.postCourseUnit = function(req,res){
	var unit = {
		name : req.body.name,
		description: req.body.description,
		order: req.body.order
	};

	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}

		course.units.push(unit);

		course.save(function(err){
			if(err){
				console.log(err);
			}

			res.json({message: 'Unit added', data: unit });
		});
	});
};

exports.getCourseUnit = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);
		res.json(unit);
	});
};

exports.putCourseUnit = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);

		unit.name = req.body.name || unit.name;
		unit.description = req.body.description || unit.description;
		unit.order = req.body.order || unit.order;
		unit.published = req.body.published || unit.published;

		course.save(function(err){
			if(err){
				console.log(err);
			}

			res.json(unit);
		});
	});
};

exports.deleteCourseUnit = function(req,res){
	
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
			res.json({error: err});
		}
		
		if(course.units.id(req.params.unit_id) === null){
			console.log('deleteCourseUnit: Unit Not Found');
			res.json({message: 'deleteCourseUnit: Unit Not Found'});
		} else {
			course.units.id(req.params.unit_id).remove();

			course.save(function(err){
				if(err){
					console.log(err);
				}

				res.json({message: 'Unit Deleted'});
			});
		}
	});
};

exports.postCourseUnitModule = function(req,res){
	
	var module = {
		name : req.body.name,
		description: req.body.description,
		length: req.body.length,
		type: req.body.type,
		order: req.body.order
	};

	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}

		var unit = course.units.id(req.params.unit_id);
		
		unit.modules.push(module);
		course.save(function(err){
			if(err){
				console.log(err);
			}
			res.json({message: 'Module Added', data: module });
		});
	});
};

exports.getCourseUnitModules = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);
		res.json(unit.modules);
	});
};

exports.getCourseUnitModule = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);
		let module = unit.modules.filter( m => m._id == req.params.module_id);
		res.json(module);
	});
};

exports.putCourseUnitModule = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);
		for (var i = 0; i < unit.modules.length; i++){
			if(unit.modules[i]._id == req.params.module_id){
				var module = unit.modules[i];

				module.name = req.body.name || module.name;
				module.description = req.body.description || module.description;
				module.length = req.body.length || module.length;
				module.type = req.body.type || module.type;
				
				if(req.body.resources){
					module.resources = JSON.parse(req.body.resources);
				}

				course.save(function(err){
					if(err){
						console.log(err);
					}
					res.json(module);
				});
			} 
			
		}
	});
};

exports.deleteCourseUnitModule = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);

		for (var i = 0; i < unit.modules.length; i++){
			if(unit.modules[i]._id == req.params.module_id){
				unit.modules.pull({_id: req.params.module_id});
				
				course.save(function(err){
					if(err){
						console.log(err);
					}
					res.json({message: 'Deleted Module'});
				});
			} 
		} 

	});
};
 */
