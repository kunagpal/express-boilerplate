var mongo = require('mongodb').MongoClient,

	app,
	testServer,
	testPort = 3000,
	rootPath = path.join(__dirname, '..', '..'),
	projectName = require(path.join(rootPath, 'package')).name;

before(function (done) {
	process.env.MONGO_URI = `mongodb://127.0.0.1:27017/${_.kebabCase(projectName)}-test`;

	mongo.connect(process.env.MONGO_URI, { w: 1 }, function (err, database) {
		if (err) { return done(err); }

		global.db = database;

		app = require(path.join(rootPath, 'app'));
		testServer = app.listen(testPort);
		done();
	});
});

after(function (done) {
	testServer.close();

	db.close(function (err) {
		delete global.db;
		done(err);
	});
});
