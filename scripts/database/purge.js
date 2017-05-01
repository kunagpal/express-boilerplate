#!/usr/bin/env node

/**
 * @file Purges the database at process.env.MONGO_URI, or the current global.db instance.
 */

/* eslint-disable no-process-env */
var chalk = require('chalk'),
	mongodb = require('mongodb').MongoClient;

/**
 * Drops the database at process.env.MONGO_URI, or the global db instance. Works only in non-production environments.
 *
 * @param {Function} done - The callback invoked to indicate that the database purge has completed.
 * @returns {*} N.A.
 */
module.exports = function (done) {
	if (global.db && db.dropDatabase) {	return db.dropDatabase(done); }

	var mongoUri,
		env = process.env.NODE_ENV;

	if (env && env !== 'test') {
		return done(new Error('Database purge will not occur on non-test environments'));
	}
	!process.env.CI && require('dotenv').load(); // eslint-disable-line global-require

	mongoUri = process.env.MONGO_URI;

	if (!mongoUri) { return done(new Error('process.env does not contain MONGO_URI')); }

	mongodb.connect(mongoUri, function (err, db) {
		err ? done(err) : db.dropDatabase(function (error) {
			if (error) { return done(error); }

			db.close(true, function (closeErr) {
				if (closeErr) { return done(closeErr); }

				!module.parent && console.info(chalk.blue(`Successfully purged db at ${chalk.bold(mongoUri)}`));
				done();
			});
		});
	});
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
