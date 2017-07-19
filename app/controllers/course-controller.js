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
	})
}

exports.getCourses = function(req,res){
	Course.find({}, function(err, courses){
		if(err){
			console.log(err);
		}
		res.json({courses})
	})
}

exports.getCourse = function(req,res){
	Course.find({ _id: req.params.course_id}, function (err,course){
		if(err){
			console.log(err);
		}
		res.json(course);
	})
}

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
		})
	})
}

exports.getCourseUnits = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}

		res.json(course.units);
	})
}

exports.postCourseUnit = function(req,res){
	var unit = {
		name : req.body.name,
		description: req.body.description,
	}

	Course.findById(req.params.course_id, function(err,course){
		course.units.push(unit);

		course.save(function(err){
		if(err){
			console.log(err);
		}

		res.json({message: 'Unit added', data: unit });
		});
	});
}

exports.getCourseUnit = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}
		var unit = course.units.id(req.params.unit_id);
		res.json(unit);
	})
}

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
		})
	})
}