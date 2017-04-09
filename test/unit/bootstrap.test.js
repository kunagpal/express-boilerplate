var supertest = require('supertest'),
	mongo = require('mongodb').MongoClient;

/* eslint-disable no-process-env*/
before(function (done) {
	process.env.MONGO_URI = `mongodb://127.0.0.1:27017/${_.kebabCase(process.env.npm_package_name ||
		require(path.resolve('package')).name)}-test`;

	mongo.connect(process.env.MONGO_URI, { w: 1 }, function (err, database) {
		if (err) { return done(err); }

		global.db = database;
		global.test = supertest(require(path.resolve('app'))); // to be used in route based tests

		done();
	});
});

after(function (done) {
	db.close(function (err) {
		delete global.db;
		done(err);
	});
});
