const fs = require('fs');
const logger = require('./logger');

const GlossaryTerm = require('./models/glossary');
const Courses = require('./models/course');


// search cache for serving to typeahead

module.exports = function(){

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

} ;