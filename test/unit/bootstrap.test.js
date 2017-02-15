var async = require('async'),
	mongo = require('mongodb').MongoClient,

	app = require(path.resolve('app')),

	testServer,
	port = 3000;

process.env.MONGO_URI = `mongodb://127.0.0.1:27017/${app.settings.title}-test`;

before(function (done) {
	async.parallel([
		function (next) {
			mongo.connect(process.env.MONGO_URI, function (err, database) {
				next(err, global.db = database);
			});
		},
		function (next) {
			next(null, testServer = app.listen(port));
		}
	], done);
});

after(function () {
	db.close();
	testServer.close();
	delete global.db;
});
