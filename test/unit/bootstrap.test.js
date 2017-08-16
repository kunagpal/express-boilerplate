var app = require('../../app'),
	supertest = require('supertest');

/* eslint-disable no-process-env*/
before(function (done) {
	app(function (err) {
		if (err) { return done(err); }

		// Type safety checks on the next line have been avoided to ensure that the tests react to changes in the app
		// bootstrapping mechanism.
		global.test = supertest(`http://localhost:${this.address().port}`);

		return done();
	});
});

after(function (done) {
	global.testUtils && testUtils.db.close(true, done);
});
