describe('User', function () {
	beforeEach(testUtils.db.user);
	afterEach(function (done) {
		testUtils.db.purge(done);
	});

	it('should be valid', function () {
		assert(_.isObject(global.User), 'User might not be a valid model');
		assert(!_.isEmpty(global.User), 'User is empty');

		assert.deepStrictEqual(_.omit(Object.getOwnPropertyDescriptor(global, 'User'), 'value'), {
			configurable: false,
			enumerable: true,
			writable: false
		}, 'User is empty');
	});

	it('should POST records correctly', function (done) {
		test
			.post('/api/users')
			.send({
				_id: 'someone@example.com',
				name: 'Some One'
			})
			.expect(200, function (err, res) {
				assert.strictEqual(err, null);

				var user = res.body.user;

				assert.strictEqual(user._id, 'someone@example.com');
				assert.strictEqual(user.name, 'Some One', '');
				assert.deepStrictEqual(user.settings, {});
				assert.strictEqual(user.authStrategy, 'local');
				assert(user.createdAt);

				done();
			});
	});

	describe('GET', function () {
		it('should GET all records correctly', function (done) {
			test
				.get('/api/users')
				.expect(200, function (err, res) {
					assert.strictEqual(err, null);
					assert.strictEqual(res.body.users.length, 1);

					done();
				});
		});

		it('should correctly pick desired fields only', function (done) {
			test
				.get('/api/users/')
				.send({ authStrategy: 1 })
				.expect(200, function (err, res) {
					assert.strictEqual(err, null);

					_.forEach(res.body.users, function (user) {
						assert.deepStrictEqual(Object.keys(user), ['_id', 'authStrategy'],
							'field filtering must work correctly');
					});
					done();
				});
		});

		describe('special cases', function () {
			beforeEach(function (done) {
				User.insertOne({
					_id: 'someone.else@example.com',
					name: 'Some One Else'
				}, done);
			});

			it('should correctly format responses where id\'s are provided', function (done) {
				test
					.get('/api/users/someone@example.com')
					.expect(200, function (err, res) {
						assert.strictEqual(err, null);

						var user = res.body.user;

						assert(user, 'GET API must format results correctly when a version is provided');
						assert(user, 1);
						done();
					});
			});

			it('should correctly pick desired fields only', function (done) {
				test
					.get('/api/users/someone.else@example.com')
					.send({ authStrategy: 1 })
					.expect(200, function (err, res) {
						assert.strictEqual(err, null);
						assert.deepStrictEqual(res.body.user, {
							_id: 'someone.else@example.com',
							authStrategy: 'local'
						});
						done();
					});
			});
		});

		describe('api headers', function () {
			describe('x-api-limit', function () {
				it('should be respected', function (done) {
					test
						.get('/api/users')
						.set('x-api-limit', '1')
						.expect(200, function (err, res) {
							assert.strictEqual(err, null, 'x-api-limit requests must work correctly');
							assert.strictEqual(res.body.users.length, 1, 'only one user should be returned');
							assert.deepStrictEqual(_.keys(res.body.users[0]), [
								'_id', 'name', 'authStrategy', 'settings', 'createdAt'
							], 'the returned user record should have all keys');

							done();
						});
				});

				it('should return one record by default if the header is invalid', function (done) {
					test
						.get('/api/users')
						.set('x-api-limit', 'random')
						.expect(200, function (err, res) {
							assert.strictEqual(err, null, 'x-api-limit requests must work correctly');
							assert.strictEqual(res.body.users.length, 1, 'only one user should be returned');
							assert.deepStrictEqual(_.keys(res.body.users[0]), [
								'_id', 'name', 'authStrategy', 'settings', 'createdAt'
							], 'the returned user record should have all keys');

							done();
						});
				});
			});

			describe('x-api-sort', function () {
				it('should be respected', function (done) {
					test
						.get('/api/users')
						.set('x-api-sort', 'name=desc')
						.expect(200, function (err, res) {
							assert.strictEqual(err, null, 'x-api-sort requests must work correctly');
							assert.strictEqual(res.body.users.length, 1, 'only one user should be returned');
							assert.deepStrictEqual(_.keys(res.body.users[0]), [
								'_id', 'name', 'authStrategy', 'settings', 'createdAt'
							], 'the returned user record should have all keys');

							done();
						});
				});

				it('should handle multiple header values correctly', function (done) {
					test
						.get('/api/users')
						.set('x-api-sort', 'name=asc')
						.set('x-api-sort', 'createdAt=desc')
						.expect(200, function (err, res) {
							assert.strictEqual(err, null, 'x-api-sort requests must work correctly');
							assert.strictEqual(res.body.users.length, 1, 'only one user should be returned');
							assert.deepStrictEqual(_.keys(res.body.users[0]), [
								'_id', 'name', 'authStrategy', 'settings', 'createdAt'
							], 'the returned user record should have all keys');

							done();
						});
				});

				it('should return all valid records if the header is invalid', function (done) {
					test
						.get('/api/users')
						.set('x-api-sort', 'random')
						.expect(200, function (err, res) {
							assert.strictEqual(err, null, 'x-api-sort requests must work correctly');
							assert.strictEqual(res.body.users.length, 1, 'only one user should be returned');
							assert.deepStrictEqual(_.keys(res.body.users[0]), [
								'_id', 'name', 'authStrategy', 'settings', 'createdAt'
							], 'the returned user record should have all keys');

							done();
						});
				});
			});

			describe('x-api-skip', function () {
				it('should be respected', function (done) {
					test
						.get('/api/users')
						.set('x-api-skip', '1')
						.expect(200, function (err, res) {
							assert.strictEqual(err, null, 'x-api-skip requests must work correctly');
							assert.deepStrictEqual(res.body, { users: [] }, 'no users should be returned');

							done();
						});
				});

				it('should return all valid records if the header is invalid', function (done) {
					test
						.get('/api/users')
						.set('x-api-skip', 'random')
						.expect(200, function (err, res) {
							assert.strictEqual(err, null, 'x-api-skip requests must work correctly');
							assert.strictEqual(res.body.users.length, 1, 'only one user should be returned');
							assert.deepStrictEqual(_.keys(res.body.users[0]), [
								'_id', 'name', 'authStrategy', 'settings', 'createdAt'
							], 'the returned user record should have all keys');

							done();
						});
				});
			});
		});
	});

	describe('PATCH', function () {
		beforeEach(function (done) {
			User.insertOne({
				_id: 'someone@example.com',
				name: 'Some One'
			}, done);
		});

		it('should not PATCH all records if id is missing', function (done) {
			test
				.patch('/api/users')
				.send({
					name: 'Someone Else'
				})
				.expect(400)
				.expect(function (res) {
					var error = res.body.error;

					assert(error, 'A valid error response should be returned');
					assert.strictEqual(error.name, 'missingId', 'A valid error name should be returned');
					assert.strictEqual(error.message, 'A valid id is required in the URL path', 'Bad error message');
					assert(error.stack, 'A valid error stack should be returned');
				})
				.end(done);
		});

		it('should PATCH records by id', function (done) {
			test
				.patch('/api/users/someone@example.com')
				.send({
					name: 'Someone Else'
				})
				.expect(200, function (err, res) {
					assert.strictEqual(err, null);
					assert.deepStrictEqual(res.body, {
						user: { n: 1, nModified: 1, ok: 1 }
					});

					done();
				});
		});
	});

	describe('DELETE', function () {
		beforeEach(function (done) {
			User.insertOne({
				_id: 'someone@example.com',
				name: 'Some One'
			}, done);
		});

		it('should not DELETE all records if id is missing', function (done) {
			test
				.del('/api/users')
				.expect(400)
				.expect(function (res) {
					var error = res.body.error;

					assert(error, 'A valid error response should be returned');
					assert.strictEqual(error.name, 'missingId', 'A valid error name should be returned');
					assert.strictEqual(error.message, 'A valid id is required in the URL path', 'Bad error message');
					assert(error.stack, 'A valid error stack should be returned');
				})
				.end(done);
		});

		it('should DELETE with an id correctly', function (done) {
			test
				.del('/api/users/someone@example.com')
				.expect(200, function (err, res) {
					assert.strictEqual(err, null);
					assert.deepStrictEqual(res.body, {
						user: { n: 1, ok: 1 }
					});

					done();
				});
		});
	});
});
