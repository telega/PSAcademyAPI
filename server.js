require('dotenv').config();
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const buildSearch = require('./app/search');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const robots = require('express-robots');
const logger = require('./app/logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var dbUrl;

if(process.env.NODE_ENV !=='test'){
	dbUrl =  process.env.DB_URL;
} else {
	dbUrl = process.env.TEST_DB;
}

const bluebird = require('bluebird');

app.use((req, res, next)=>{
	if (req.header('host') == 'academybypatsnap.herokuapp.com') {
		logger.info('Redirecting Heroku host to academy.patsnap.com');
		res.redirect(301,'https://academy.patsnap.com');
	} else {
		next();
	}
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/public',express.static('public'));

if(process.env.NODE_ENV!='production'){
	app.use(robots({UserAgent: '*', Disallow: '/'}));
} else {
	app.use(robots({UserAgent: '*', Disallow: ['/forgot','/password','/reset', '/admin']}));
}

mongoose.promise = bluebird;
mongoose.connect(dbUrl, {
	useMongoClient:true
});

require('./config/passport')(passport);

app.use(cors());

//logging setup 

if((process.env.NODE_ENV !== 'test') && (process.env.NODE_ENV !== 'production')){
	app.use(morgan('dev'));
}
if(process.env.NODE_ENV == 'production'){
	app.use(morgan('tiny'));
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized:false,
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes')(app, passport);

buildSearch();

module.exports = app.listen(port, function(){
	logger.info('Listening on ' + port);

});