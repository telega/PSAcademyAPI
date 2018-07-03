const fs = require('fs');
const logger = require('./logger');
const _ = require('lodash');

const GlossaryTerm = require('./models/glossary');
const Courses = require('./models/course');
const Tag = require('./models/tag');

const Fuse = require('fuse.js');

// search cache for serving to typeahead on client

exports.buildSearchJSON = function(){

	Promise.all([
		GlossaryTerm.find({}),
		Courses.find({}),
		Tag.find({})
	])
		.then(([glossaryTerms, courses, tags])=>{

			return Promise.resolve([
				glossaryTerms.map((term)=>{
					return {'display':term.heading, 'link': '/glossary#' + term.anchorLink };
				}),
				courses.map((course)=>{
					return {'display': course.name, 'link': '/courses/' + course._id };
				}),
				tags.map((tag)=>{
					return {'display': tag.name, 'link': '/tags/' + tag._id};
				})
			]);
		})
		.then(([glossaryTerms,courses, tags])=>{
			let data ={
				'courses': courses,
				'glossary': glossaryTerms,
				'tags': tags,
			};


			fs.writeFile('./search/search.json', JSON.stringify({'data':data}), (err)=>{
				if(err){
					return err;
				}
				return logger.info('Search JSON updated');
			});

		})
		.catch((err)=>{
			logger.error(err);
		});

};

exports.fuseSearch = function(query){
	var options = {
		shouldSort: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: ['searchKey']
	};

	return Promise.all([
		GlossaryTerm.find({}),
		Courses.find({}),
		Tag.find({})
	])
		.then(([glossaryTerms, courses, tags])=>{
			return Promise.resolve([
				courses.map((course)=>{
					return {'searchKey':course.name, 'title': course.name,'type':'course', 'link': '/courses/' + course._id, 'id': course._id };
				}),
				glossaryTerms.map((term)=>{
					return {'searchKey':term.heading, 'title':term.heading,'type':'glossary', 'link': '/glossary#' + term.anchorLink, 'id': term._id };
				}),
				tags.map((tag)=>{
					return {'searchKey':tag.name, 'title': tag.name,'type':'tag', 'link': '/tags/' + tag._id, 'id': tag._id };
				}),
				
			]);
		})
		.then(([glossaryTerms, courses, tags])=>{
			let data = _.flatten(_.concat( courses, glossaryTerms, tags));
			return data;
		})
		.then((data)=>{
			let fuse = new Fuse(data, options);
			let result = fuse.search(query);
			// we want unique results
			result = _.uniqBy(result,'id');
			return result;
		})
		.catch((err)=>{
			logger.error(err);
		});

};