//var Course = require('../models/course');

const Tag = require('../models/tag');
const logger = require('../logger');
const { check, validationResult } = require('express-validator/check');

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

// exports.putTag = function(req,res){
// 	Tag.findOne({_id: req.params.tag_id}).exec()
// 		.then((tag)=>{
// 			feedback.title = req.body.title  || feedback.title;
// 			feedback.description = req.body.description || feedback.description;
// 			if(typeof(req.body.published) !== 'undefined'){
// 				feedback.published = req.body.published;
// 			}
			
// 			return tag.save(()=>{
// 				res.status(200).json({message: 'tag updated'});
// 			});			
// 		})
// 		.catch((err)=>{
// 			logger.error(err);
// 			res.status(500).json({message:err});
// 		});
	
// };

// exports.deleteFeedback = function(req,res){
// 	Feedback.remove({_id: req.params.feedback_id}).exec()
// 		.then(()=>{
// 			res.status(200).json({message:'feedback deleted'});
// 		})
// 		.catch((err)=>{
// 			logger.error(err);
// 			res.status(500).json({message:err});
// 		});
	
// };
