/**
 * @file Handles the creation of a HTTP server on process.env.PORT, and consumes the provided app instance.
 */

/* eslint-disable no-process-env */
var path = require('path'),

	_ = require('lodash'),
	mongodb = require('mongodb').MongoClient,

	app,
	port;

process.env.NODE_ENV ? utils.checkVars() : require('dotenv').load();

process.on('SIGINT', utils.handle);
port = Number(process.env.PORT) || 3000;

/**
 * Establishes a reusable database connection to the database at MONGO_URI, and starts an HTTP server.
 *
 * @param {Function} done - The callback invoked at the end of the app start routine.
 */
mongodb.connect(process.env.MONGO_URI ||
	// eslint-disable-next-line global-require
	`mongodb://127.0.0.1:27017/${_.kebabCase(process.env.npm_package_name || require(path.resolve('package')).name)}`,
	{ w: 1 }, function (err, database) {
		if (err) { throw err; }

		global.db = database;

		// eslint-disable-next-line global-require
		app = require(path.resolve('app'));

		app.set('port', port);
		app.on('error', utils.handle);
		app.listen(port);
	});
