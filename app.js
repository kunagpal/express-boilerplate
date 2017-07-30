/**
 * @file The application bootstrapper.
 */

/* eslint-disable no-process-env */
global._ = require('lodash');
global.path = require('path');
global.utils = require('./utils/misc');

var fs = require('fs'),

	cors = require('cors'),
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

	pack = require('./scripts/misc/pack'),

	port,
	app = express(),
	env = process.env.NODE_ENV, // repeated process.env related operations are expensive, so cache once and reuse
	isLive = env && !_.includes(['development', 'test'], env),
	name = process.env.npm_package_name || require('./package').name; // eslint-disable-line global-require

isLive ? utils.checkVars() : require('dotenv').load();

// view engine setup
app.set('title', name);
app.set('view engine', 'ejs');
app.enable('trust proxy');
app.set('views', 'views');
app.set('port', port = Number(process.env.PORT) || 3000);

app.use(helmet());
app.use(compression());
app.use('/api', cors({ origin: false }), function (req, res, next) {
	var accept = req.get('accept');

	// If the Accept header is generic or unspecified, set it so that API responses are JSON by default.
	// This is necessary so that the app error handling middleware below can be reused for all kinds of requests.
	((accept === '*/*') || !accept) && (req.headers.accept = 'application/json');

	next();
});

app.use('/static', express.static(path.resolve('public/min')));

(env !== 'test') && app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET, { signed: true }));

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

module.exports = function (done) {
	mongodb.connect(process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${_.kebabCase(name)}${env ? '-' + env : ''}`,
		{ w: 1 }, function (mongoError, db) {
			if (mongoError) { throw mongoError; }

			(env === 'test') && _.set(global, 'testUtils.db', {
				close: db.close.bind(db),
				purge: function (next) {
					db.dropDatabase(next); // bind has not been used here for test performance reasons
				}
			});
			_.forEach(fs.readdirSync('database'), function (model) { // eslint-disable-line no-sync
				// This ensures that the models can't be messed with.
				(model = path.parse(model).name) && Object.defineProperty(global, model, {
					value: utils.makeModel(model, db), // eslint-disable-line global-require
					configurable: false,
					writable: false,
					enumerable: true
				});
			});

			var routes = load(path.resolve('routes')),

				/**
				 * Handles error and SIGINT events.
				 *
				 * @param {?Error} err - An error object, optionally passed on from the error event.
				 */
				handle = function (err) {
					// No throwing errors here, as this function is used to handle uncaught exceptions
					db && db.close && db.close(function (error) {
						// DB close errors aren't exactly fatal here, but log them anyway
						error && console.error(error.message);

						if (err) {
							console.error(err.message);
							process.exit(1);
						}

						process.exit(0);
					});
				};

			app.on('error', handle);
			process.on('SIGINT', handle);
			process.on('uncaughtException', handle);

			app.use('/api', routes.api) && delete routes.api;
			app.use(csurf());

			_.forEach(routes, function (router, mountPoint) {
				app.use(`/${mountPoint === 'index' ? '' : mountPoint}`, router);
			});

			// catch 404 and forward to error handler
			app.use(function (req, res, next) {
				var err = new Error('Not Found');

				err.status = 404;
				next(err);
			});

			// error handlers
			isLive && app.use(errorHandler(process.env.SENTRY_DSN));

			// eslint-disable-next-line no-unused-vars
			app.use(function (err, req, res, next) { // the last argument is necessary
				var error = {
					status: Number(err.status) || 500
				};

				err.name && (error.name = err.name);
				res.status(error.status);

				// _.assign has not been used here to avoid creating a new object with the stack and error message.
				if (!isLive) { // Pass the complete error stack and message to the response if running in a dev/test env
					error.stack = err.stack;
					error.message = err.message;
				}

				// can't use conditional _.omit on err here as details will be lost
				return res.format({
					html: function () {
						res.render('error', { error: error });
					},
					json: function () {
						res.json({ error: error });
					},
					default: function () {
						// set the status code and it's corresponding human friendly message in one go.
						res.sendStatus(406);
					}
				});
			});

			pack(function (err) {
				if (err) { throw err; } // An error in static asset compression is usually fatal, abort app load
				app.listen(port, done);
			});
		});
};

!module.parent && module.exports(_.noop);
