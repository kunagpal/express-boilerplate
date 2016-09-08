var path = require('path'),

	_ = require('lodash'),
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

	errorHandler,
	app = express();

if (!_.get(process, 'env.NODE_ENV')) {
	require('dotenv').load();
}

errorHandler = sentry.errorHandler(process.env.SENTRY_DSN);
// view engine setup
app.set('title', 'express-boilerplate');
app.set('view engine', 'ejs');
app.enable('trust proxy');
app.set('views', path.join(__dirname, 'views'));

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
	if (!_.has(req, 'session.flash')) {
		_.set(req, 'session.flash', []);
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

	err.status = 404;
	next(err);
});

// error handlers
if (_.get(process, 'env.NODE_ENV')) {
	app.use(errorHandler);
}

app.use(function (err, req, res, next) { // the last argument is necessary
	var error = {},
		status = _.get(err, 'status', 500);

	res.status(status);
	res.clearCookie('team', {});
	res.clearCookie('phone', {});

	if (err.code === 'EBADCSRFTOKEN') {
		res.redirect(req.headers.referer);
	}
	else {
		_.set(error, 'status', status);

		if (process.env.NODE_ENV) {
			_.set(error, 'stack', '');
			_.set(error, 'message', '');
		}
		else {
			_.set(error, 'stack', _.get(err, 'stack'));
			_.set(error, 'message', _.get(err, 'message'));
		}

		res.render('error', error);
	}
});

module.exports = app;
