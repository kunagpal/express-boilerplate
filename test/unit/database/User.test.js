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

	describe('.findOne', function () {
		describe('no data', function () {
			describe('callbacks', function () {
				it('should handle missing queries correctly', function (done) {
					User.findOne(function (err, result) {
						assert.strictEqual(err, null, 'User.findOne should not return an error for no data');
						assert.strictEqual(result, null, 'User.findOne should not return a result for no data');

						done();
					});
				});

				it('should handle singular query entities correctly', function (done) {
					User.findOne('someone@example.com', function (err, result) {
						assert.strictEqual(err, null, 'User.findOne should not return an error for no data');
						assert.strictEqual(result, null, 'User.findOne should not return a result for no data');

						done();
					});
				});

				it('should handle non-existent queries correctly', function (done) {
					User.findOne({}, function (err, result) {
						assert.strictEqual(err, null, 'User.findOne should not return an error for no data');
						assert.strictEqual(result, null, 'User.findOne should not return a result for no data');

						done();
					});
				});
			});

			describe('promises', function () {
				it('should handle missing queries correctly', function (done) {
					User
						.findOne()
						.then(function (result) {
							assert.strictEqual(result, null, 'User.findOne should not return a result for no data');
							done();
						}, done)
						.catch(done);
				});

				it('should handle non-existent queries correctly', function (done) {
					User
						.findOne({})
						.then(function (result) {
							assert.strictEqual(result, null, 'User.findOne should not return a result for no data');
							done();
						}, done)
						.catch(done);
				});
			});
		});

		describe('valid data', function () {
			var email = 'someone@example.com';

			describe('callbacks', function () {
				var data = { email: email };

				beforeEach(function (done) {
					User.insert(data, done);
				});

				it('should handle missing queries correctly', function (done) {
					User.findOne(function (err, result) {
						assert.strictEqual(err, null, 'User.findOne should not return an error for valid data');
						assert.deepStrictEqual(result._id, email, 'User.findOne doesn\'t return a valid result');

						done();
					});
				});

				it('should handle singular query entites correctly', function (done) {
					User.findOne(email, function (err, result) {
						assert.strictEqual(err, null, 'User.findOne should not return an error for no data');
						assert.strictEqual(result._id, email, 'User.findOne should not return a result for valid data');

						done();
					});
				});

				it('should handle non-existent queries correctly', function (done) {
					User.findOne({ email: 'somebody@example.com' }, function (err, result) {
						assert.strictEqual(err, null, 'User.findOne should not return an error for no data');
						assert.strictEqual(result, null, 'User.findOne should not return a result for no matches');

						done();
					});
				});
			});

			describe('promises', function () {
				beforeEach(function (done) {
					User
						.insert({ email: email })
						.then(function () { done(); }, done)
						.catch(done);
				});

				it('should handle missing queries correctly', function (done) {
					User
						.findOne()
						.then(function (result) {
							assert.strictEqual(result._id, email, 'User.findOne doesn\'t return a result correctly');
							done();
						}, done)
						.catch(done);
				});

				it('should handle singular query entities correctly', function (done) {
					User
						.findOne(email)
						.then(function (result) {
							assert.strictEqual(result._id, email, 'User.findOne doesn\'t return a result correctly');
							done();
						}, done)
						.catch(done);
				});

				it('should handle non-existent queries correctly', function (done) {
					User
						.findOne({})
						.then(function (result) {
							assert.strictEqual(result._id, email, 'User.findOne doesn\'t return a result correctly');
							done();
						}, done)
						.catch(done);
				});
			});
		});
	});

	describe('.find', function () {
		describe('no data', function () {
			describe('callbacks', function () {
				var validate = function (err, result) {
					assert.strictEqual(err, null, 'Error should be null for User.find');
					assert.deepStrictEqual(result, [], 'User.find does not return an empty set for no matches');
				};

				it('should handle default queries correctly', function (done) {
					User.find(function (err, result) { // eslint-disable-line lodash/prefer-lodash-method
						if (err) { return done(err); }

						validate(err, result);

						done();
					});
				});

				it('should handle primary key based queries correctly', function (done) {
					// eslint-disable-next-line lodash/prefer-lodash-method
					User.find('someone@example.com', function (err, result) {
						if (err) { return done(err); }

						validate(err, result);

						done();
					});
				});

				it('should handle object based queries correctly', function (done) {
					// eslint-disable-next-line lodash/prefer-lodash-method
					User.find({ _id: 'someone@example.com' }, function (err, result) {
						if (err) { return done(err); }

						validate(err, result);

						done();
					});
				});
			});

			describe('promises', function () {
				it('should handle default queries correctly', function (done) {
					User // eslint-disable-line lodash/prefer-lodash-method
						.find()
						.then(function (result) {
							assert.deepStrictEqual(result, [], 'User.find doesn\'t return an empty set for no matches');

							done();
						}, done)
						.catch(done);
				});

				it('should handle primary key based queries correctly', function (done) {
					User // eslint-disable-line lodash/prefer-lodash-method
						.find('someone@example.com')
						.then(function (result) {
							assert.deepStrictEqual(result, [], 'User.find doesn\'t return an empty set for no matches');

							done();
						}, done)
						.catch(done);
				});

				it('should handle object based queries correctly', function (done) {
					User // eslint-disable-line lodash/prefer-lodash-method
						.find({ _id: 'someone@example.com' })
						.then(function (result) {
							assert.deepStrictEqual(result, [], 'User.find doesn\'t return an empty set for no matches');

							done();
						}, done)
						.catch(done);
				});
			});
		});

		describe('valid data', function () {
			var validate = function (err, result) {
				!result && (result = err) && (err = null);

				assert.strictEqual(err, null, 'Error should be null for User.find');
				assert.deepStrictEqual(result.length, 1, 'User records may be mutated!');
				assert.strictEqual(result[0]._id, 'someone@example.com', 'User records may be polluted');
			};

			describe('callbacks', function () {
				beforeEach(function (done) {
					User.insert({ email: 'someone@example.com' }, done);
				});

				it('should handle default queries correctly', function (done) {
					User.find(function (err, result) { // eslint-disable-line lodash/prefer-lodash-method
						if (err) { return done(err); }

						validate(err, result);

						done();
					});
				});

				it('should handle primary key based queries correctly', function (done) {
					// eslint-disable-next-line lodash/prefer-lodash-method
					User.find('someone@example.com', function (err, result) {
						if (err) { return done(err); }

						validate(err, result);

						done();
					});
				});

				it('should handle object based queries correctly', function (done) {
					// eslint-disable-next-line lodash/prefer-lodash-method
					User.find({ _id: 'someone@example.com' }, function (err, result) {
						if (err) { return done(err); }

						validate(err, result);

						done();
					});
				});
			});

			describe('promises', function () {
				beforeEach(function (done) {
					User
						.insert({ email: 'someone@example.com' })
						.then(function () { done(); }, done)
						.catch(done);
				});

				it('should handle default queries correctly', function (done) {
					User // eslint-disable-line lodash/prefer-lodash-method
						.find()
						.then(function (result) {
							validate(result);

							done();
						}, done)
						.catch(done);
				});

				it('should handle primary key based queries correctly', function (done) {
					User // eslint-disable-line lodash/prefer-lodash-method
						.find('someone@example.com')
						.then(function (result) {
							validate(result);

							done();
						}, done)
						.catch(done);
				});

				it('should handle object based queries correctly', function (done) {
					User // eslint-disable-line lodash/prefer-lodash-method
						.find({ _id: 'someone@example.com' })
						.then(function (result) {
							validate(result);

							done();
						}, done)
						.catch(done);
				});
			});
		});
	});
});
