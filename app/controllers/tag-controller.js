const Course = require('../models/course');
const Tag = require('../models/tag');
const logger = require('../logger');
const { check, validationResult } = require('express-validator/check');
const mongoose = require('mongoose');
//const _ = require(lodash);

exports.getTags = function(req,res){
	Tag.find({}).exec()
		.then((tags) => res.status(200).json(tags))
		.catch((err) => {
			logger.error(err);
			res.status(500).json({message:err});
		});
};

exports.validatePostTag = [
	check('name').exists().withMessage('Must exist.'),
	function (req,res,next){
		let errors = validationResult(req);
		if( !errors.isEmpty() ){
			res.status(422).json({message: errors.mapped()});
		} else {
			next();
		}
	}
];

exports.postTag = function(req,res){

	let tag = new Tag();
	tag.name = req.body.name;
	tag.save((err)=>{
		if(err){
			logger.error(err);
		}
		res.status(200).json({message: 'Tag Added'});
	});
};

exports.validatePutTag = [
	check('tag_id').exists().isAlphanumeric().withMessage('Must exist and be Alphanumeric'),
	
	function (req,res,next){
		let errors = validationResult(req);
		if( !errors.isEmpty() ){
			logger.debug('validateGetUnitProgress FAIL');
			res.status(422).json({message: errors.mapped()});
		} else {
			next();
		}
	}
];

exports.putTag = function(req,res){
	Tag.findOne({_id: req.params.tag_id}).exec()
		.then((tag)=>{
			tag.name = req.body.name  || tag.name;

			// prefer if client sends both courseID and unitID 
			if(req.body.unit && req.body.course){	
				tag.units.push({
					unit: req.body.unit,
					parentCourse: req.body.course
				});
			}

			if(req.body.course && ( typeof(req.body.unit)=='undefined' )){
				tag.courses.push(req.body.course);
			}

			// worst case have to loop and find the course from unit.
			if(req.body.unit && ( typeof(req.body.course)=='undefined'  )){
				let course = null;
				
				Course.find({}).exec()
					.then((courses)=>{
						return courses.filter((course)=>{
							let c = course.units.filter((unit)=>{

								return unit._id.equals( mongoose.Types.ObjectId(req.body.unit) );
							});
							return c.length > 0;
						});
					})
					.then((filteredCourses)=>{
						course = filteredCourses[0]._id;

						tag.units.push({
							unit: req.body.unit,
							parentCourse: course
						});

						return tag.save(()=>{
							res.status(200).json({message: 'tag updated'});
						});		
					});

					
			} else {
				return tag.save(()=>{
					res.status(200).json({message: 'tag updated'});
				});		
			}
						
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).json({message:err});
		});
};

exports.deleteTag = function(req,res){
	Tag.remove({_id: req.params.tag_id}).exec()
		.then(()=>{
			res.status(200).json({message:'Tag Deleted'});
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).json({message:err});
		});
	
};
