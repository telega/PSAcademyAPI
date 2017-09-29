var Course = require('../models/course');
const { check, validationResult } = require('express-validator/check');
const logger = require('../logger');



exports.validatePostCourse = [
	check('name').exists().isAlphanumeric().withMessage('Must exist and be an Alphanumeric'),
	function (req,res,next){
		let errors = validationResult(req);
		if( !errors.isEmpty() ){
			res.status(422).json({message: errors.mapped()});
		} else {
			next();
		}
	}
];


exports.postCourse = function(req,res){
	var course = new Course();
	course.name = req.body.name;
	course.description = req.body.description;
	course.order = req.body.order;
	course.save(function(err){
		if(err){
			res.status(500).json({message: 'Error adding Course'});
		} else {
			res.status(200).json({message: 'Course Added', course: course});
		}
	});
};

exports.getCourses = function(req,res){
	Course.find({}, function(err, courses){
		if(err){
			logger.error(err);
		}
		res.status(200).json(courses);
	});
};

exports.getCourse = function(req,res){
	Course.find({ _id: req.params.course_id}, function (err,course){
		if(err){
			logger.error(err);
		}
		res.json(course);
	});
};

exports.putCourse = function(req,res){
	Course.findById(req.params.course_id, function(err, course){
		if(err){
			logger.error(err);
		}
		course.name = req.body.name || course.name;
		course.description = req.body.description || course.description;
		course.order = req.body.order || course.order;
		course.published = req.body.published || course.published;
		course.courseImageUrl = req.body.courseImageUrl || course.courseImageUrl;
		course.courseThumbImageUrl = req.body.courseThumbImageUrl || course.courseThumbImageUrl;

		course.save(function(err){
			if(err){
				logger.error(err);
			}
			res.json(course);
		});
	});
};

exports.deleteCourse = function(req,res){
	Course.remove({ _id: req.params.course_id }, function(err){
		if(err){
			logger.error(err);
		}
		res.status(200).json({message: 'Deleted Course'});
	});
};

exports.getCourseUnits = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			logger.error(err);
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
			logger.error(err);
		}

		course.units.push(unit);

		course.save(function(err){
			if(err){
				logger.error(err);
			}

			res.json({message: 'Unit added', data: unit });
		});
	});
};

exports.getCourseUnit = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			logger.error(err);
		}
		var unit = course.units.id(req.params.unit_id);
		res.json(unit);
	});
};

exports.putCourseUnit = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			logger.error(err);
		}
		var unit = course.units.id(req.params.unit_id);

		unit.name = req.body.name || unit.name;
		unit.description = req.body.description || unit.description;
		unit.order = req.body.order || unit.order;
		unit.published = req.body.published || unit.published;
		unit.unitImageUrl = req.body.unitImageUrl || unit.unitImageUrl;
		unit.unitThumbImageUrl = req.body.unitThumbImageUrl || unit.unitThumbImageUrl;

		course.save(function(err){
			if(err){
				logger.error(err);
			}

			res.json(unit);
		});
	});
};

exports.deleteCourseUnit = function(req,res){
	
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			logger.error(err);
			res.json({error: err});
		}
		
		if(course.units.id(req.params.unit_id) === null){
			logger.warn('deleteCourseUnit: Unit Not Found');
			res.json({message: 'deleteCourseUnit: Unit Not Found'});
		} else {
			course.units.id(req.params.unit_id).remove();

			course.save(function(err){
				if(err){
					logger.error(err);
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
			logger.error(err);
		}

		var unit = course.units.id(req.params.unit_id);
		
		unit.modules.push(module);
		course.save(function(err){
			if(err){
				logger.error(err);
			}
			res.json({message: 'Module Added', data: module });
		});
	});
};

exports.getCourseUnitModules = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			logger.error(err);
		}
		var unit = course.units.id(req.params.unit_id);
		res.json(unit.modules);
	});
};

exports.getCourseUnitModule = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			logger.error(err);
		}
		var unit = course.units.id(req.params.unit_id);
		let module = unit.modules.filter( m => m._id == req.params.module_id);
		res.json(module);
	});
};

exports.putCourseUnitModule = function(req,res){
	Course.findById(req.params.course_id, function(err,course){
		if(err){
			logger.error(err);
		}
		var unit = course.units.id(req.params.unit_id);
		for (var i = 0; i < unit.modules.length; i++){
			if(unit.modules[i]._id == req.params.module_id){
				var module = unit.modules[i];

				module.name = req.body.name || module.name;
				module.description = req.body.description || module.description;
				module.length = req.body.length || module.length;
				module.type = req.body.type || module.type;
				module.contentId = req.body.contentId || module.contentId;
				
				if(req.body.resources){
					module.resources = JSON.parse(req.body.resources);
				}

				course.save(function(err){
					if(err){
						logger.error(err);
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
			logger.error(err);
		}
		var unit = course.units.id(req.params.unit_id);

		for (var i = 0; i < unit.modules.length; i++){
			if(unit.modules[i]._id == req.params.module_id){
				unit.modules.pull({_id: req.params.module_id});
				
				course.save(function(err){
					if(err){
						logger.error(err);
					}
					res.json({message: 'Deleted Module'});
				});
			} 
		} 

	});
};
