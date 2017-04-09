/**
 * @file The application bootstrapper.
 */

/* eslint-disable no-process-env */
global._ = require('lodash');
global.path = require('path');

var cors = require('cors'),
	csurf = require('csurf'),
	logger = require('morgan'),
	helmet = require('helmet'),
	express = require('express'),
	load = require('require-all'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	cookieParser = require('cookie-parser'),
	expressSession = require('express-session'),

	routes = load(path.resolve('routes')),
	onError = require('raven').errorHandler(process.env.SENTRY_DSN),
	name = process.env.npm_package_name || require('./package').name,

	app = express();

global.utils = require('./utils/misc'); // inject utils into the global namespace
_.merge(global, load(path.resolve('database'))); // inject models into the global namespace

// view engine setup
app.set('title', name);
app.set('view engine', 'ejs');
app.enable('trust proxy');
app.set('views', 'views');

app.use(helmet());
app.use(compression());
app.use('/api', cors({ origin: false }));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET, { signed: true }));
app.use(express.static(path.resolve('public')));

app.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(csurf());

app.use(function (req, res, next) {
	!req.session.flash && (req.session.flash = []);

	res.flash = function (content) {
		return content ? req.session.flash.push(content) : req.session.flash.pop();
	};

	next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes.index);

delete routes.index;

_.forEach(routes, function (router, mountPoint) {
	app.use(`/${mountPoint}`, router);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');

	err.status = utils.NOT_FOUND;
	next(err);
});

// error handlers
process.env.NODE_ENV && app.use(onError);

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) { // the last argument is necessary
	res.status(err.status = err.status || utils.INTERNAL_SERVER_ERROR);

	if (err.code === utils.CSRF_TOKEN_ERROR) {
		return res.redirect(req.headers.referer);
	}

	if (process.env.NODE_ENV) {
		delete err.stack;
		delete err.message;
	}

	return res.render('error', err);
});

module.exports = app;
