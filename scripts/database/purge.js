/**
 * @file Purges the database at process.env.MONGO_URI.
 */

var chalk = require('chalk'),
	mongodb = require('mongodb').MongoClient;

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
	throw new Error('Database purge will not occur on non-test environments');
}

/**
 * Drops the database at process.env.MONGO_URI.
 *
 * @param {Function} done - The callback invoked to indicate that the database drop has completed.
 * @returns {Promise|*} A MongoDB connection stub.
 */
module.exports = function (done) {
	return mongodb.connect(process.env.MONGO_URI, function (err, db) {
		if (err) { return done(err); }

		return db.dropDatabase(function (error) {
			if (error) { return done(error); }

			db.close();
			console.info(chalk.green(`Successfully purged database at ${process.env.MONGO}`));

			return done();
		});
	});
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
