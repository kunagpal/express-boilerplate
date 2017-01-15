var mongodb = require('mongodb').MongoClient;

if (process.env.NODE_ENV) {
	throw new Error('Database purge will not occur on production environments');
}

module.exports = function (done) {
	return mongodb.connect(process.env.MONGO, function (err, db) {
		if (err) {
			return done(err);
		}

		return db.dropDatabase(function (error) {
			if (error) {
				return done(error);
			}

			db.close();
			console.info(`Successfully purged database at ${process.env.MONGO}`);
			done();
		});
	});
};

!module.parent && module.exports(process.exit);
