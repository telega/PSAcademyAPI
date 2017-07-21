var Course = require('../models/course');

exports.postCourse = function(req,res){
	var course = new Course();
	course.name = req.body.name;
	course.description = req.body.description;
	course.save(function(err){
		if(err){
			console.log(err);
		}
		res.json({message: 'Course Added', data: course});
	});
};

exports.getCourses = function(req,res){
	Course.find({}, function(err, courses){
		if(err){
			console.log(err);
		}
		res.json({courses});
	});
};

exports.getCourse = function(req,res){
	Course.find({ _id: req.params.course_id}, function (err,course){
		if(err){
			console.log(err);
		}
		res.json(course);
	});
};

exports.putCourse = function(req,res){
	Course.findById(req.params.course_id, function(err, course){
		if(err){
			console.log(err);
		}
		course.name = req.body.name || course.name;
		course.description = req.body.description || course.description;

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
	};

	Course.findById(req.params.course_id, function(err,course){
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

		course.save(function(err){
			if(err){
				console.log(err);
			}

			res.json(unit);
		});
	});
};

exports.postCourseUnitModule = function(req,res){
	
	var module = {
		name : req.body.name,
		description: req.body.description,
		length: req.body.length,
		type: req.body.type
	};

	Course.findById(req.params.course_id, function(err,course){
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
		
		//now we need to loop and this is probably not very efficient
		var module = {};
		for (var i = 0; i < unit.modules.length; i++){
			if(unit.modules[i]._id == req.params.module_id){
				module = unit.modules[i];
			}
		}

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
			} else {
				res.json({message: 'Cannot Update'});
			} 
		}
	});
};
