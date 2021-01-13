var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

//Database var
var db = require('mongoose');
db.connect('mongodb://localhost/project', {
	useNewUrlParser: true,
	useUnifiedTopology: true
	}, (err) => {
		if (err)
			console.log("MongoDB connection error: "+err);
		else
			console.log("Connected to MongoDB");
});

//Set the Schema for "users"
var userSchema = new db.Schema({
	name: String,
	email: String,
	password: String
});

//Set the Schema for "answers"
var ansSchema = new db.Schema({
	content: String,
	uid: db.Schema.Types.ObjectId,
	time: Date
});

//Set the Schema for "questions"
var queSchema = new db.Schema({
	space: String,
	title: String,
	content: String,
	answer: [db.Schema.Types.ObjectId],
	up: [db.Schema.Types.ObjectId],
	time: Date,
	creatorid: db.Schema.Types.ObjectId
});

//Create models
var user = db.model("user", userSchema, "users");
var answer = db.model("answer", ansSchema, "answers");
var question = db.model("question", queSchema, "questions");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var questionRouter = require('./routes/questions');

var app = express();
app.use(session({secret: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"})); //adding session to pipeline

//Make our model "user" accessible to routers
app.use(function(req,res,next) {
	req.user = user;
	next();
});

//Make our model "answer" accessible to routers
app.use(function(req,res,next) {
	req.answer = answer;
	next();
});

//Make our model "question" accessible to routers
app.use(function(req,res,next) {
	req.question = question;
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/questions', questionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
