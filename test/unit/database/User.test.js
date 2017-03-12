describe('User', function () {
	afterEach(purge);

	describe('.insertOne', function () {
		describe('error handling', function () {
			describe('callbacks', function () {
				it('should result in an error for missing data', function (done) {
					User.insertOne(function (err) {
						assert.equal(err.message, 'Invalid user data', 'User.insertOne does not handle missing data');
						done();
					});
				});

				it('should result in an error for empty data', function (done) {
					User.insertOne(null, function (err) {
						assert.equal(err.message, 'Invalid user data', 'User.insertOne does not handle empty data');
						done();
					});
				});

				it('should result in an error for malformed data', function (done) {
					User.insertOne('someone@example.com', function (err) {
						assert.equal(err.message, 'Invalid user data', 'User.insertOne does not handle malformed data');
						done();
					});
				});
			});

			describe('promises', function () {
				it('should result in an error for missing data', function (done) {
					User
						.insertOne()
						.then(done, function (err) {
							assert.equal(err.message, 'Invalid user data', 'User.insertOne mishandles missing data');
							done();
						})
						.catch(done);
				});

				it('should result in an error for empty data', function (done) {
					User
						.insertOne(null)
						.then(done, function (err) {
							assert.equal(err.message, 'Invalid user data', 'User.insertOne does not handle empty data');
							done();
						})
						.catch(done);
				});

				it('should result in an error for malformed data', function (done) {
					User
						.insertOne('someone@example.com')
						.then(done, function (err) {
							assert.equal(err.message, 'Invalid user data', 'User.insertOne mishandled malformed data');
							done();
						})
						.catch(done);
				});
			});
		});

		describe('duplicate data', function () {
			describe('callbacks', function () {
				beforeEach(function (done) {
					User.insertOne({ email: 'someone@user.com', authStrategy: 'admin' }, done);
				});

				it('should result in an error', function (done) {
					User.insertOne({ email: 'someone@user.com', authStrategy: 'local' }, function (err, user) {
						assert(err.message, 'User.insertOne does not handle duplicate data correctly');
						assert(!user, 'User.insertOne leaks data on duplicate insertion');
						done();
					});
				});
			});

			describe('promises', function () {
				beforeEach(function (done) {
					User
						.insertOne({ email: 'someone@user.com', authStrategy: 'admin' })
						.then(function (user) {
							assert(_.isObject(user) && !_.isEmpty(user), 'User.insertOne may not be working correctly');
							done();
						}, done)
						.catch(done);
				});

				it('should result in an error', function (done) {
					User
						.insertOne({ email: 'someone@user.com', authStrategy: 'local' })
						.then(done, function (err) {
							assert(err.message, 'User.insertOne does not handle duplicate data correctly');
							done();
						})
						.catch(done);
				});
			});
		});

		describe('normal functioning', function () {
			describe('callbacks', function () {
				it('should insert a user correctly', function (done) {
					User.insertOne({ email: 'someone@example.com' }, function (err, user) {
						if (err) { return done(err); }

						assert(_.isObject(user) && !_.isEmpty(user), 'User record was not created correctly');
						done();
					});
				});
			});

			describe('promises', function () {
				it('should insert a user correctly', function (done) {
					User
						.insertOne({ email: 'someone@example.com' })
						.then(function (user) {
							assert(_.isObject(user) && !_.isEmpty(user), 'User record was not created correctly');
							done();
						}, done)
						.catch(done);
				});
			});
		});
	});
});
