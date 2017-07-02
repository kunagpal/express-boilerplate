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
	mongodb = require('mongodb').MongoClient,
	expressSession = require('express-session'),
	errorHandler = require('raven').errorHandler,

	port,
	app = express(),
	env = process.env.NODE_ENV,
	isLive = env && !_.includes(['development', 'test'], env),
	name = process.env.npm_package_name || require('./package').name; // eslint-disable-line global-require

isLive ? utils.checkVars() : require('dotenv').load();

// view engine setup
app.set('title', name);
app.set('view engine', 'ejs');
app.enable('trust proxy');
app.set('views', 'views');
app.set('port', port = Number(process.env.PORT) || 3000);

app.on('error', utils.handle);

app.use(helmet());
app.use(compression());
app.use('/api', cors({ origin: false }));

(env !== 'test') && app.use(logger('dev'));
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

process.on('SIGINT', utils.handle);
process.on('uncaughtException', utils.handle);

module.exports = function (done) {
	mongodb.connect(process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${_.kebabCase(name)}${env ? '-' + env : ''}`,
		{ w: 1 }, function (error, db) {
			if (error) { throw error; }

			var routes,
				models = load({
					dirname: path.resolve('database'),
					resolve: function (stub) {
						return stub(db);
					}
				});

			_.forEach(models, function (value, model) {
				// This ensures that the models can be messed with.
				Object.defineProperty(global, model, {
					value: value,
					configurable: false,
					writable: false,
					enumerable: true
				});
			});

			routes = load(path.resolve('routes'));

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

			app.listen(port, done);
		});
};

!module.parent && module.exports(_.noop);
