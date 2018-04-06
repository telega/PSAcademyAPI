const fs = require('fs');
const logger = require('./logger');

const GlossaryTerm = require('./models/glossary');
const Courses = require('./models/course');

const Fuse = require('fuse.js')

// search cache for serving to typeahead on client

exports.buildSearchJSON = function(){

	Promise.all([
		GlossaryTerm.find({}),
		Courses.find({})
	])
		.then(([glossaryTerms, courses])=>{
			return Promise.resolve([
				glossaryTerms.map((term)=>{
					return {'display':term.heading, 'link': '/glossary#' + term.anchorLink };
				}),
				courses.map((course)=>{
					return {'display': course.name, 'link': '/courses/' + course._id };
				})
			]);
		})
		.then(([glossaryTerms,courses])=>{
			let data ={
				'glossary': glossaryTerms,
				'courses': courses
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

	//console.log('query:' + query)
	var options = {
		shouldSort: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: ['title']
	};

	return Promise.all([
		GlossaryTerm.find({}),
		Courses.find({})
	])
		.then(([glossaryTerms, courses])=>{
			return Promise.resolve([
				glossaryTerms.map((term)=>{
					return {'title':term.heading,'type':'glossary', 'link': '/glossary#' + term.anchorLink };

				}),
				courses.map((course)=>{
					return {'title': course.name,'type':'course', 'link': '/courses/' + course._id };

				})
			]);
		})
		.then(([glossaryTerms,courses])=>{
			let data = glossaryTerms.concat(courses)
			//console.log(data)

			let fuse = new Fuse(data, options);
			let result = fuse.search(query)
			//console.log(result)
			return result;

		})
		.catch((err)=>{
			logger.error(err);
		});

}