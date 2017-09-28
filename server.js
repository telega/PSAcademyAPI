require('dotenv').config();
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
var dbUrl;
if(process.env.NODE_ENV !=='test'){
	dbUrl =  process.env.DB_URL;
} else {
	dbUrl = process.env.TEST_DB;
}

const bluebird = require('bluebird');
 
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/public',express.static('public'));

mongoose.promise = bluebird;
mongoose.connect(dbUrl, {
	useMongoClient:true
});

require('./config/passport')(passport);

app.use(cors());
if(process.env.NODE_ENV !== 'test'){
	app.use(morgan('dev'));
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
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes')(app, passport);

module.exports = app.listen(port, function(){
	console.log('Listening on ' + port);
});