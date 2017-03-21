describe('User', function () {
	afterEach(purge);

	describe('.insert', function () {
		describe('error handling', function () {
			describe('callbacks', function () {
				it('should result in an error for missing data', function (done) {
					User.insert(function (err) {
						assert.equal(err.message, 'Invalid user data', 'User.insert does not handle missing data');
						done();
					});
				});

				it('should result in an error for empty data', function (done) {
					User.insert(null, function (err) {
						assert.equal(err.message, 'Invalid user data', 'User.insert does not handle empty data');
						done();
					});
				});

				it('should result in an error for malformed data', function (done) {
					User.insert('someone@example.com', function (err) {
						assert.equal(err.message, 'Invalid user data', 'User.insert does not handle malformed data');
						done();
					});
				});
			});

			describe('promises', function () {
				it('should result in an error for missing data', function (done) {
					User
						.insert()
						.then(done, function (err) {
							assert.equal(err.message, 'Invalid user data', 'User.insert mishandles missing data');
							done();
						})
						.catch(done);
				});

				it('should result in an error for empty data', function (done) {
					User
						.insert(null)
						.then(done, function (err) {
							assert.equal(err.message, 'Invalid user data', 'User.insert does not handle empty data');
							done();
						})
						.catch(done);
				});

				it('should result in an error for malformed data', function (done) {
					User
						.insert('someone@example.com')
						.then(done, function (err) {
							assert.equal(err.message, 'Invalid user data', 'User.insert mishandled malformed data');
							done();
						})
						.catch(done);
				});
			});
		});

		describe('duplicate data', function () {
			describe('callbacks', function () {
				beforeEach(function (done) {
					User.insert({ email: 'someone@user.com', authStrategy: 'admin' }, done);
				});

				it('should result in an error', function (done) {
					User.insert({ email: 'someone@user.com', authStrategy: 'local' }, function (err, user) {
						assert(err.message, 'User.insert does not handle duplicate data correctly');
						assert(!user, 'User.insert leaks data on duplicate insertion');
						done();
					});
				});
			});

			describe('promises', function () {
				beforeEach(function (done) {
					User
						.insert({ email: 'someone@user.com', authStrategy: 'admin' })
						.then(function (user) {
							assert(_.isObject(user) && !_.isEmpty(user), 'User.insert may not be working correctly');
							done();
						}, done)
						.catch(done);
				});

				it('should result in an error', function (done) {
					User
						.insert({ email: 'someone@user.com', authStrategy: 'local' })
						.then(done, function (err) {
							assert(err.message, 'User.insert does not handle duplicate data correctly');
							done();
						})
						.catch(done);
				});
			});
		});

		describe('normal functioning', function () {
			describe('callbacks', function () {
				it('should insert a user correctly', function (done) {
					User.insert({ email: 'someone@example.com' }, function (err, user) {
						if (err) { return done(err); }

						assert(_.isObject(user) && !_.isEmpty(user), 'User record was not created correctly');
						done();
					});
				});

				it('should insert multiple users correctly', function (done) {
					User.insert([{ email: 'someone@example.com' }, { email: 'someone.else@example.com' }],
						function (err, meta) {
							if (err) { return done(err); }

							assert.deepStrictEqual(meta.result, { ok: 1, n: 2 }, 'Bulk records weren\'t inserted');
							assert.deepStrictEqual(meta.insertedIds, ['someone@example.com',
								'someone.else@example.com'], 'Users not created properly');

							done();
						});
				});
			});

			describe('promises', function () {
				it('should insert a user correctly', function (done) {
					User
						.insert({ email: 'someone@example.com' })
						.then(function (user) {
							assert(_.isObject(user) && !_.isEmpty(user), 'User record was not created correctly');
							done();
						}, done)
						.catch(done);
				});

				it('should insert multiple users correctly', function (done) {
					User
						.insert([{ email: 'someone@example.com' }, { email: 'someone.else@example.com' }])
						.then(function (meta) {
							assert.deepStrictEqual(meta.result, { ok: 1, n: 2 }, 'Bulk records weren\'t inserted');
							assert.deepStrictEqual(meta.insertedIds, ['someone@example.com',
								'someone.else@example.com'], 'Users not created properly');

							done();
						})
						.catch(done);
				});
			});
		});
	});
});
