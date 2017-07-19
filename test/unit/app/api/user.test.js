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
				.expect(400, {
					error: { name: 'missingId', message: 'A valid id is required in the url path' }
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
				.expect(400, {
					error: { name: 'missingId', message: 'A valid id is required in the url path' }
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
