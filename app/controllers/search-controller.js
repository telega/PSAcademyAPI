const logger = require('../logger');
const path = require('path');
const gravatar = require('gravatar');
const search = require('../search');



//using gravatars
function getAvatarUrl(req){
	if(req.user){
		return	gravatar.url(req.user.local.email, {s: '75', r: 'pg', d: 'mm'}); 
	} else {
		return null;
	}
}

exports.sendSearchJSON =  function(req,res){
	res.setHeader('Cache-Control', 'public, max-age=300');
	res.type('json');
	res.status(200);
	res.sendFile(path.join(__dirname, '../../search', 'search.json'));
};


exports.postSearch = function(req,res,next){
	let query = req.body.query;
	logger.info('Searched: ' + query);

	search.fuseSearch(query).then((results)=>{
		req.searchResults = results;
		next();
	});

};

exports.getSearchResults = function(req,res){

	let searchResults = null;
	
	if((req.searchResults) && (req.searchResults.length  > 0 )){
		searchResults = req.searchResults;
	}

	let pageInfo = {
		title: 'Search',
		breadcrumbs: [
			{title:'<span class="fa fa-home" aria-hidden="true"></span>', url: '/'},
			{title:'Search', url: '/search'}
		],
		activeNavItem: 'Search',
		jumbotronImageUrl:'https://www.patsnap.com/hubfs/Webinars/Guest%20speaker%20webinars%20/Roshan/Introduction%20to%20Markush/1519_Introduction-to-searching-using-Markush-structures-from-Patents_Header.jpg' 
	};
	
	let avatarUrl = getAvatarUrl(req);
	res.render('academy/search.ejs', { pageInfo: pageInfo, user: req.user, avatarUrl: avatarUrl, searchResults: searchResults});

};