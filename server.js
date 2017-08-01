const express = require('express');
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
const configDB =  require('./config/database');
const bluebird = require('bluebird');

mongoose.promise = bluebird;
mongoose.connect(configDB.url, {
	useMongoClient:true
});

require('./config/passport')(passport);

app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(session({
	secret: 'ilovescotchscotchyscotchscotch',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes')(app, passport);

app.listen(port, function(){
	console.log('Listening on ' + port);
});