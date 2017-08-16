var Course = require('../models/course');

exports.getCourses = function(req,res){
	Course.find({}, function(err, courses){
		if(err){
			console.log(err);
		}
		res.render('academy/courses.ejs', {user: req.user, courses: courses});
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


exports.getCourseUnits = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			console.log(err);
		}

		res.json(course.units);
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