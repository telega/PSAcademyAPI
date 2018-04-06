var GlossaryTerm = require('../models/glossary');
const { check, validationResult } = require('express-validator/check');
const logger = require('../logger');
const search = require('../search');



exports.validatePostGlossaryTerm = [
	check('heading').exists().withMessage('Must exist.'),
	function (req,res,next){
		let errors = validationResult(req);
		if( !errors.isEmpty() ){
			logger.debug('validatePostGlossaryTerm FAIL');
			res.status(422).json({message: errors.mapped()});
		} else {
			next();
		}
	}
];

exports.postGlossaryTerm = function(req,res){
	var term = new GlossaryTerm();
	term.heading = req.body.heading;
	term.definition = req.body.definition;
	term.moreLink = req.body.moreLink;
	term.anchorLink = term.generateDefaultAnchor();
	term.save(function(err){
		if(err){
			logger.error(err);
			res.status(400).json({message: 'Error adding Glossary Term'});
		} else {
			search.buildSearchJSON();
			res.status(200).json({message: 'Term Added', data: term});
		}
	});
};

exports.putGlossaryTerm = function(req,res){
	GlossaryTerm.findById(req.params.term_id, function(err,term){
		if(err){
			logger.error(err);
		}
		term.heading = req.body.heading || term.heading;
		term.definition = req.body.definition|| term.definition;
		term.moreLink = req.body.moreLink || term.moreLink;
		term.anchorLink = req.body.anchorLink || term.anchorLink;
	
		term.save(function(err){
			if(err){
				logger.error(err);
			}
			search.buildSearchJSON();
			res.json(term);
		});
	});
};

exports.deleteGlossaryTerm = function(req,res){
	GlossaryTerm.remove({ _id: req.params.term_id }, function(err){
		if(err){
			logger.error(err);
		}
		search.buildSearchJSON();
		res.status(200).json({message: 'Deleted Term'});
		
	});
};