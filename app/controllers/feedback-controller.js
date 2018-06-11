//var User = require('../models/user');
//var Course = require('../models/course');
//var Quiz = require('../models/quiz');
//var Academy = require('../models/academy');
var Feedback = require('../models/feedback');
const logger = require('../logger');



exports.getFeedback = function(req,res){
	

	Feedback.find({}).exec()
		.then((feedback) => res.status(200).json(feedback))
		.catch((err) => {
			logger.error(err);
			res.status(500).json({message:err});
		});
};

exports.putFeedback = function(req,res){
	Feedback.findOne({_id: req.params.feedback_id}).exec()
		.then((feedback)=>{
			feedback.title = req.body.title  || feedback.title;
			feedback.description = req.body.description || feedback.description;
			if(typeof(req.body.published) !== 'undefined'){
				feedback.published = req.body.published;
			}
			
			return feedback.save(()=>{
				res.status(200).json({message: 'feedback updated'});
			});			
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).json({message:err});
		});
	
};

exports.deleteFeedback = function(req,res){
	Feedback.remove({_id: req.params.feedback_id}).exec()
		.then(()=>{
			res.status(200).json({message:'feedback deleted'});
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).json({message:err});
		});
	
};
