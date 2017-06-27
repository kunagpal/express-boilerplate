var app = require('../../app'),
	supertest = require('supertest');

/* eslint-disable no-process-env*/
before(function (done) {
	global.test = supertest('http://localhost:3000');

	app(done);
});

after(function (done) {
	global.db && db.close ? db.close(function (err) {
		delete process.env.NODE_ENV;
		delete global.db;
		done(err);
	}) : done();
});
