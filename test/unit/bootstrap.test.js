var mongo = require('mongodb').MongoClient,

	app,
	testServer,
	testPort = 3000,
	rootPath = path.join(__dirname, '..', '..'),
	projectName = require(path.join(rootPath, 'package')).name,
	purge = require(path.join(rootPath, 'scripts', 'database', 'purge'));

before(function (done) {
	process.env.MONGO_URI = `mongodb://127.0.0.1:27017/${_.kebabCase(projectName)}-test`;

	mongo.connect(process.env.MONGO_URI, function (err, database) {
		if (err) { return done(err); }

		global.db = database;
		global.purge = purge;

		app = require(path.join(rootPath, 'app'));
		testServer = app.listen(testPort);
		done();
	});
});

after(function () {
	testServer.close();
	db.close();

	delete global.db;
});
