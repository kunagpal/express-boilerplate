/**
 * @file The application bootstrapper.
 */

/* eslint-disable no-process-env */
global._ = require('lodash');
global.path = require('path');
global.utils = require('./utils/misc');

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
	errorHandler = require('raven').errorHandler,

	routes,
	app = express(),
	name = process.env.npm_package_name || require('./package').name, // eslint-disable-line global-require
	isLive = process.env.NODE_ENV && !_.includes(['development', 'test'], process.env.NODE_ENV);

// eslint-disable-next-line global-require
_.merge(global, load(path.resolve('database'))); // inject models into the global namespace
routes = load(path.resolve('routes'));

// view engine setup
app.set('title', name);
app.set('view engine', 'ejs');
app.enable('trust proxy');
app.set('views', 'views');
app.set('port', Number(process.env.PORT) || 3000);

app.on('error', utils.handle);

app.use(helmet());
app.use(compression());
app.use('/api', cors({ origin: false }));

(process.env.NODE_ENV !== 'test') && app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET, { signed: true }));
app.use(express.static(path.resolve('public')));

app.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

app.use(function (req, res, next) {
	!req.session.flash && (req.session.flash = []);

	/**
	 * An elementary flash message handler to interface across the back and front ends via a series of flash messages.
	 *
	 * @param {String} content - A flash message to displayed on the front end.
	 * @returns {Number|String} - A stub returned to indicate the message displayed or the current length of the queue.
	 */
	res.flash = function (content) {
		return content ? req.session.flash.push(content) : req.session.flash.pop();
	};

	next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes.api) && delete routes.api;
app.use(csurf());

_.forEach(routes, function (router, mountPoint) {
	app.use(`/${mountPoint === 'index' ? '' : mountPoint}`, router);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');

	err.status = utils.NOT_FOUND;
	next(err);
});

// error handlers
isLive && app.use(errorHandler(process.env.SENTRY_DSN));

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) { // the last argument is necessary
	res.status(err.status = err.status || utils.INTERNAL_SERVER_ERROR);

	return res.render('error', { error: _.omit(err, isLive && ['stack', 'message']) });
});

module.exports = app;
