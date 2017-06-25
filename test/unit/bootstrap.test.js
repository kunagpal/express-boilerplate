var dotenv = require('dotenv'),
	supertest = require('supertest'),
	mongo = require('mongodb').MongoClient;

/* eslint-disable no-process-env*/
before(function (done) {
	dotenv.load();

	// eslint-disable-next-line global-require
	var packageName = _.kebabCase(process.env.npm_package_name || require(path.resolve('package').name));

	mongo.connect(`mongodb://127.0.0.1:27017/${packageName}-test`, { w: 1 }, function (err, database) {
		if (err) { return done(err); }

		global.db = database;
		process.env.NODE_ENV = 'test';

		var app = require(path.resolve('app')); // eslint-disable-line global-require

		app.listen(Number(process.env.PORT) || 3000);

		// eslint-disable-next-line global-require
		global.test = supertest(`http://localhost:${app.get('port')}`);
		process.on('SIGINT', utils.handle); // utils is exposed as a global in app.js

		return done();
	});
});

after(function (done) {
	global.db && db.close ? db.close(function (err) {
		delete process.env.NODE_ENV;
		delete global.db;
		done(err);
	}) : done();
});
