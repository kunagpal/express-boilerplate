var path = require('path'),

	csurf = require('csurf'),
	logger = require('morgan'),
	helmet = require('helmet'),
	express = require('express'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	cookieParser = require('cookie-parser'),
	expressSession = require('express-session'),
	sentry = require('raven').middleware.express,

	api = require(path.join(__dirname, 'routes', 'api')),
	index = require(path.join(__dirname, 'routes', 'index')),
	users = require(path.join(__dirname, 'routes', 'users')),

	errorHandler = sentry.errorHandler(process.env.SENTRY_DSN),
	app = express(),

	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500,
	CSRF_TOKEN_ERROR = 'EBADCSRFTOKEN';

// view engine setup
app.set('title', 'express-boilerplate');
app.set('view engine', 'ejs');
app.enable('trust proxy');
app.set('views', 'views');

app.use(helmet());
app.use(compression());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET || 'cookie_secret', { signed: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({ secret: process.env.SESSION_SECRET || 'session_secret', resave: '', saveUninitialized: '' }));
app.use(csurf());

app.use(function (req, res, next) {
	if (!req.session.flash) {
		req.session.flash = [];
	}

	res.flash = function (content) {
		if (content) {
			req.session.flash.push(content);
		}
		else {
			return req.session.flash.pop();
		}
	};

	next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/api', api);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');

	err.status = NOT_FOUND;
	next(err);
});

// error handlers
if (process.env.NODE_ENV) {
	app.use(errorHandler);
}

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) { // the last argument is necessary
	err.status = err.status || INTERNAL_SERVER_ERROR;
	res.status(err.status);

	if (err.code === CSRF_TOKEN_ERROR) {
		return res.redirect(req.headers.referer);
	}

	if (process.env.NODE_ENV) {
		delete err.stack;
		delete err.message;
	}

	res.render('error', err);
});

module.exports = app;
