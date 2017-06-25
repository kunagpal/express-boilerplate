describe('User', function () {
	beforeEach(testUtils.db.user);
	afterEach(purge);

	it('should be valid', function () {
		assert(_.isObject(global.User), 'User might not be a valid model');
		assert(!_.isEmpty(global.User), 'User is empty');
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

	it('should GET all records correctly', function (done) {
		test
			.get('/api/users')
			.expect(200, function (err, res) {
				assert.strictEqual(err, null);
				assert.strictEqual(res.body.users.length, 1);

				done();
			});
	});

	it('should PUT records correctly', function (done) {
		test
			.put('/api/users')
			.send({
				name: 'Someone Else'
			})
			.expect(200, function (err, res) {
				assert.strictEqual(err, null);
				assert.deepStrictEqual(res.body, {
					users: { n: 1, nModified: 1, ok: 1 }
				});

				done();
			});
	});

	it('should DELETE all records correctly', function (done) {
		test
			.del('/api/users')
			.expect(200, function (err, res) {
				assert.strictEqual(err, null);
				assert.deepStrictEqual(res.body, {
					users: { n: 1, ok: 1 }
				});

				done();
			});
	});
});
