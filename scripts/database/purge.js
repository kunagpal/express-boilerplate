var mongodb = require('mongodb').MongoClient;

if (process.env.NODE_ENV) {
	throw new Error('Database purge will not occur on production environments');
}
mongodb.connect(process.env.MONGO, function (err, db) {
	if (err) {
		throw err;
	}

	db.dropDatabase(function (error) {
		if (error) {
			throw error;
		}

		console.info(`Sucessfully purged database at ${process.env.MONGO}`);
	});
});
