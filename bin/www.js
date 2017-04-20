/**
 * @file Handles the creation of a HTTP server on process.env.PORT, and consumes the provided app instance.
 */

/* eslint-disable no-process-env */
var path = require('path'),

	_ = require('lodash'),
	mongodb = require('mongodb').MongoClient,

	app,
	port,

	/**
	 * Handles error and SIGINT events for the current process.
	 *
	 * @param {?Error} err - The error instance passed on from the caller.
	 */
	onErr = function (err) {
		db && db.close && db.close(function (error) {
			var e = err || error; // prioritize the unhandled error over the db connection close error

			if (e) { throw e; }

			process.exit(0);
		});
	};

process.env.NODE_ENV ? utils.checkVars() : require('dotenv').load();

process.on('SIGINT', onErr);
port = Number(process.env.PORT) || 3000;

/**
 * Establishes a reusable database connection to the database at MONGO_URI, and starts an HTTP server.
 *
 * @param {Function} done - The callback invoked at the end of the app start routine.
 */
mongodb.connect(process.env.MONGO_URI ||
	`mongodb://127.0.0.1:27017/${_.kebabCase(process.env.npm_package_name || require(path.resolve('package')).name)}`,
	{ w: 1 }, function (err, database) {
		if (err) { throw err; }

		global.db = database;

		app = require(path.resolve('app'));

		app.set('port', port);
		app.on('error', onErr);
		app.listen(port);
	});
