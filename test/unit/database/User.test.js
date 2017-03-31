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

	describe('.updateOne', function () {
		describe('no data', function () {
			describe('callbacks', function () {
				it('should handle invalid inserts correctly', function (done) {
					User.updateOne('someone@example.com', function (err, result) {
						assert.strictEqual(err, null, 'Error might be malformed');
						assert.strictEqual(result.upsertedId, null);
						assert.strictEqual(result.matchedCount, 0, 'User.updateOne does not handle invalid matches');
						assert.strictEqual(result.modifiedCount, 0, 'User.updateOne does not handle invalid updates');
						assert.strictEqual(result.upsertedCount, 0, 'User.updateOne does not handle invalid upserts');
						assert.deepStrictEqual(result.result, { n: 0, nModified: 0, ok: 1 }, 'User.updateOne error');

						done();
					});
				});

				it('should handle non-existent targets correctly', function (done) {
					User.updateOne('someone@example.com', { foo: 'bar' }, function (err, result) {
						assert.strictEqual(err, null, 'User.updateOne should not error out for invalid targets');
						assert.strictEqual(result.upsertedId, null);
						assert.strictEqual(result.matchedCount, 0, 'User.updateOne does not handle invalid matches');
						assert.strictEqual(result.modifiedCount, 0, 'User.updateOne does not handle invalid updates');
						assert.strictEqual(result.upsertedCount, 0, 'User.updateOne does not handle invalid upserts');
						assert.deepStrictEqual(result.result, { n: 0, nModified: 0, ok: 1 }, 'User.updateOne error');

						done();
					});
				});

				it('should handle generic queries correctly', function (done) {
					User.updateOne({ foo: 'bar' }, function (err, result) {
						assert.strictEqual(err, null, 'User.updateOne should not error out for invalid targets');
						assert.strictEqual(result.upsertedId, null);
						assert.strictEqual(result.matchedCount, 0, 'User.updateOne does not handle invalid matches');
						assert.strictEqual(result.modifiedCount, 0, 'User.updateOne does not handle invalid updates');
						assert.strictEqual(result.upsertedCount, 0, 'User.updateOne does not handle invalid upserts');
						assert.deepStrictEqual(result.result, { n: 0, nModified: 0, ok: 1 }, 'User.updateOne error');

						done();
					});
				});
			});

			describe('promises', function () {
				it('should handle invalid inserts correctly', function (done) {
					User
						.updateOne('someone@example.com')
						.then(function (meta) {
							assert.deepStrictEqual(meta.result, { n: 0, nModified: 0, ok: 1 }, 'User.updateOne err');
							assert.strictEqual(meta.upsertedId, null);
							assert.strictEqual(meta.matchedCount, 0, 'User.updateOne invalid matche handle error');
							assert.strictEqual(meta.modifiedCount, 0, 'User.updateOne invalid update handle error');
							assert.strictEqual(meta.upsertedCount, 0, 'User.updateOne invalid upsert handle error');
							done();
						}, done)
						.catch(done);
				});

				it('should handle non-existent targets correctly', function (done) {
					User
						.updateOne('someone@example.com', { foo: 'bar' })
						.then(function (result) {
							assert.strictEqual(result.upsertedId, null);
							assert.strictEqual(result.matchedCount, 0, 'User.updateOne invalid matche handle error');
							assert.strictEqual(result.modifiedCount, 0, 'User.updateOne invalid update handle error');
							assert.strictEqual(result.upsertedCount, 0, 'User.updateOne invalid upsert handle error');
							assert.deepStrictEqual(result.result, { n: 0, nModified: 0, ok: 1 }, 'User.updateOne err');
							done();
						}, done)
						.catch(done);
				});

				it('should handle generic queries correctly', function (done) {
					User
						.updateOne({ foo: 'bar' })
						.then(function (result) {
							assert.strictEqual(result.upsertedId, null);
							assert.strictEqual(result.matchedCount, 0, 'User.updateOne invalid matche handle error');
							assert.strictEqual(result.modifiedCount, 0, 'User.updateOne invalid update handle error');
							assert.strictEqual(result.upsertedCount, 0, 'User.updateOne invalid upsert handle error');
							assert.deepStrictEqual(result.result, { n: 0, nModified: 0, ok: 1 }, 'User.updateOne err');
							done();
						}, done)
						.catch(done);
				});
			});
		});

		describe('valid update targets', function () {
			describe('callbacks', function () {
				beforeEach(function (done) {
					User.insert([{ email: 'someone@example.com', authStrategy: 'local' },
						{ email: 'somebody@example.com', authStrategy: 'admin' }], done);
				});

				it('should correctly update an arbitrary document', function (done) {
					User.updateOne({ authStrategy: 'random' }, function (err, result) {
						assert.strictEqual(err, null, 'User.updateOne does not update arbitrary records correctly');
						assert.strictEqual(result.matchedCount, 1, 'User.updateOne did not match records to update');
						assert.strictEqual(result.upsertedCount, 0, 'User.updateOne upsertedCount mismatch');
						assert.strictEqual(result.upsertedId, null, 'User.updateOne upsertedId mismatch');
						assert.strictEqual(result.modifiedCount, 1, 'User.updateOne modifiedCount mismatch');

						done();
					});
				});

				it('should correctly update a document found with a singular query', function (done) {
					User.updateOne('somebody@example.com', { authStrategy: 'local' }, function (err, result) {
						assert.strictEqual(err, null, 'User.updateOne does not update arbitrary records correctly');
						assert.strictEqual(result.matchedCount, 1, 'User.updateOne did not match records to update');
						assert.strictEqual(result.upsertedCount, 0, 'User.updateOne upsertedCount mismatch');
						assert.strictEqual(result.upsertedId, null, 'User.updateOne upsertedId mismatch');
						assert.strictEqual(result.modifiedCount, 1, 'User.updateOne modifiedCount mismatch');

						done();
					});
				});

				it('should correctly update an specific document', function (done) {
					User.updateOne({ authStrategy: 'local' }, { authStrategy: 'admin' }, function (err, result) {
						assert.strictEqual(err, null, 'User.updateOne does not update arbitrary records correctly');
						assert.strictEqual(result.matchedCount, 1, 'User.updateOne did not match records to update');
						assert.strictEqual(result.upsertedCount, 0, 'User.updateOne upsertedCount mismatch');
						assert.strictEqual(result.upsertedId, null, 'User.updateOne upsertedId mismatch');
						assert.strictEqual(result.modifiedCount, 1, 'User.updateOne modifiedCount mismatch');

						done();
					});
				});
			});

			describe('promises', function () {
				beforeEach(function (done) {
					User
						.insert([
							{ email: 'someone@example.com', authStrategy: 'local' },
							{ email: 'somebody@example.com', authStrategy: 'admin' }])
						.then(function () { done(); }, done)
						.catch(done);
				});

				it('should correctly update an arbitrary document', function (done) {
					User
						.updateOne({ authStrategy: 'random' })
						.then(function (result) {
							assert.strictEqual(result.matchedCount, 1, 'User.updateOne didn\'t get records to update');
							assert.strictEqual(result.upsertedCount, 0, 'User.updateOne upsertedCount mismatch');
							assert.strictEqual(result.upsertedId, null, 'User.updateOne upsertedId mismatch');
							assert.strictEqual(result.modifiedCount, 1, 'User.updateOne modifiedCount mismatch');

							done();
						}, done)
						.catch(done);
				});

				it('should correctly update a document found with a singular query', function (done) {
					User
						.updateOne('somebody@example.com', { authStrategy: 'local' })
						.then(function (result) {
							assert.strictEqual(result.matchedCount, 1, 'User.updateOne did not get records to update');
							assert.strictEqual(result.upsertedCount, 0, 'User.updateOne upsertedCount mismatch');
							assert.strictEqual(result.upsertedId, null, 'User.updateOne upsertedId mismatch');
							assert.strictEqual(result.modifiedCount, 1, 'User.updateOne modifiedCount mismatch');

							done();
						}, done)
						.catch(done);
				});

				it('should correctly update an specific document', function (done) {
					User
						.updateOne({ authStrategy: 'local' }, { authStrategy: 'admin' })
						.then(function (result) {
							assert.strictEqual(result.matchedCount, 1, 'User.updateOne did not get records to update');
							assert.strictEqual(result.upsertedCount, 0, 'User.updateOne upsertedCount mismatch');
							assert.strictEqual(result.upsertedId, null, 'User.updateOne upsertedId mismatch');
							assert.strictEqual(result.modifiedCount, 1, 'User.updateOne modifiedCount mismatch');

							done();
						}, done)
						.catch(done);
				});
			});
		});
	});

	describe('.deleteOne', function () {
		describe('no data', function () {
			describe('callbacks', function () {
				it('should handle missing delete queries', function (done) {
					User.deleteOne(function (err, result) {
						assert.strictEqual(err, null, 'User.deleteOne should not return an error for no data');
						assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.deleteOne should not remove');
						assert.strictEqual(result.deletedCount, 0, 'User.deleteOne should not remove records');

						done();
					});
				});

				it('should handle singular delete queries', function (done) {
					User.deleteOne('someone@example.com', function (err, result) {
						assert.strictEqual(err, null, 'User.deleteOne should not return an error for no data');
						assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.deleteOne should not remove');
						assert.strictEqual(result.deletedCount, 0, 'User.deleteOne should not remove records');

						done();
					});
				});

				it('should handle invalid delete queries', function (done) {
					User.deleteOne({}, function (err, result) {
						assert.strictEqual(err, null, 'User.deleteOne should not return an error for no data');
						assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.deleteOne should not remove');
						assert.strictEqual(result.deletedCount, 0, 'User.deleteOne should not remove records');

						done();
					});
				});
			});

			describe('promises', function () {
				it('should handle missing delete queries', function (done) {
					User
						.deleteOne()
						.then(function (result) {
							assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.deleteOne should not remove');
							assert.strictEqual(result.deletedCount, 0, 'User.deleteOne should not remove records');

							done();
						}, done)
						.catch(done);
				});

				it('should handle singular delete queries', function (done) {
					User
						.deleteOne('someone@example.com')
						.then(function (result) {
							assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.deleteOne should not remove');
							assert.strictEqual(result.deletedCount, 0, 'User.deleteOne should not remove records');

							done();
						}, done)
						.catch(done);
				});

				it('should handle invalid delete queries', function (done) {
					User
						.deleteOne({})
						.then(function (result) {
							assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.deleteOne should not remove');
							assert.strictEqual(result.deletedCount, 0, 'User.deleteOne should not remove records');

							done();
						}, done)
						.catch(done);
				});
			});
		});

		describe('valid data', function () {
			describe('callbacks', function () {
				beforeEach(function (done) {
					User.insert([{ email: 'someone@example.com' }, { email: 'somebody@example.com' }], done);
				});

				it('should handle missing delete queries', function (done) {
					User.deleteOne(function (err, result) {
						assert.strictEqual(err, null, 'User.deleteOne should not return an error for no data');
						assert.deepStrictEqual(result.result, { n: 1, ok: 1 }, 'User.deleteOne remove error');
						assert.strictEqual(result.deletedCount, 1, 'User.deleteOne didn\'t remove correctly');

						done();
					});
				});

				it('should handle singular delete queries', function (done) {
					User.deleteOne('someone@example.com', function (err, result) {
						assert.strictEqual(err, null, 'User.deleteOne should not return an error for no data');
						assert.deepStrictEqual(result.result, { n: 1, ok: 1 }, 'User.deleteOne remove error');
						assert.strictEqual(result.deletedCount, 1, 'User.deleteOne didn\'t remove correctly');

						done();
					});
				});

				it('should handle invalid delete queries', function (done) {
					User.deleteOne({}, function (err, result) {
						assert.strictEqual(err, null, 'User.deleteOne should not return an error for no data');
						assert.deepStrictEqual(result.result, { n: 1, ok: 1 }, 'User.deleteOne remove error');
						assert.strictEqual(result.deletedCount, 1, 'User.deleteOne didn\'t remove correctly');

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

				it('should handle missing delete queries', function (done) {
					User
						.deleteOne()
						.then(function (result) {
							assert.deepStrictEqual(result.result, { n: 1, ok: 1 }, 'User.deleteOne remove error');
							assert.strictEqual(result.deletedCount, 1, 'User.deleteOne did not remove records');

							done();
						}, done)
						.catch(done);
				});

				it('should handle singular delete queries', function (done) {
					User
						.deleteOne('someone@example.com')
						.then(function (result) {
							assert.deepStrictEqual(result.result, { n: 1, ok: 1 }, 'User.deleteOne remove error');
							assert.strictEqual(result.deletedCount, 1, 'User.deleteOne did not remove records');

							done();
						}, done)
						.catch(done);
				});

				it('should handle invalid delete queries', function (done) {
					User
						.deleteOne({})
						.then(function (result) {
							assert.deepStrictEqual(result.result, { n: 1, ok: 1 }, 'User.deleteOne remove error');
							assert.strictEqual(result.deletedCount, 1, 'User.deleteOne did not remove records');

							done();
						}, done)
						.catch(done);
				});
			});
		});
	});

	describe('.delete', function () {
		describe('no data', function () {
			describe('callbacks', function () {
				it('should handle missing delete queries', function (done) {
					User.delete(function (err, result) {
						assert.strictEqual(err, null, 'User.delete should not return an error for no data');
						assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.delete should not remove');
						assert.strictEqual(result.deletedCount, 0, 'User.delete should not remove records');

						done();
					});
				});

				it('should handle singular delete queries', function (done) {
					User.delete('someone@example.com', function (err, result) {
						assert.strictEqual(err, null, 'User.deleteOne should not return an error for no data');
						assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.delete should not remove');
						assert.strictEqual(result.deletedCount, 0, 'User.delete should not remove records');

						done();
					});
				});

				it('should handle invalid delete queries', function (done) {
					User.delete({}, function (err, result) {
						assert.strictEqual(err, null, 'User.delete should not return an error for no data');
						assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.delete should not remove');
						assert.strictEqual(result.deletedCount, 0, 'User.delete should not remove records');

						done();
					});
				});
			});

			describe('promises', function () {
				it('should handle missing delete queries', function (done) {
					User
						.delete()
						.then(function (result) {
							assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.delete should not remove');
							assert.strictEqual(result.deletedCount, 0, 'User.delete should not remove records');

							done();
						}, done)
						.catch(done);
				});

				it('should handle singular delete queries', function (done) {
					User
						.delete('someone@example.com')
						.then(function (result) {
							assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.delete should not remove');
							assert.strictEqual(result.deletedCount, 0, 'User.delete should not remove records');

							done();
						}, done)
						.catch(done);
				});

				it('should handle invalid delete queries', function (done) {
					User
						.delete({})
						.then(function (result) {
							assert.deepStrictEqual(result.result, { n: 0, ok: 1 }, 'User.delete should not remove');
							assert.strictEqual(result.deletedCount, 0, 'User.delete should not remove records');

							done();
						}, done)
						.catch(done);
				});
			});
		});

		describe('valid data', function () {
			describe('callbacks', function () {
				beforeEach(function (done) {
					User.insert([{ email: 'someone@example.com' }, { email: 'somebody@example.com' }], done);
				});

				it('should handle missing delete queries', function (done) {
					User.delete(function (err, result) {
						assert.strictEqual(err, null, 'User.delete should not return an error for no data');
						assert.deepStrictEqual(result.result, { n: 2, ok: 1 }, 'User.delete remove error');
						assert.strictEqual(result.deletedCount, 2, 'User.delete didn\'t remove correctly');

						done();
					});
				});

				it('should handle invalid delete queries', function (done) {
					User.delete({}, function (err, result) {
						assert.strictEqual(err, null, 'User.delete should not return an error for no data');
						assert.deepStrictEqual(result.result, { n: 2, ok: 1 }, 'User.delete remove error');
						assert.strictEqual(result.deletedCount, 2, 'User.delete didn\'t remove correctly');

						done();
					});
				});
			});

			describe('promises', function () {
				beforeEach(function (done) {
					User
						.insert([{ email: 'someone@example.com' }, { email: 'somebody@example.com' }])
						.then(function () { done(); }, done)
						.catch(done);
				});

				it('should handle missing delete queries', function (done) {
					User
						.delete()
						.then(function (result) {
							assert.deepStrictEqual(result.result, { n: 2, ok: 1 }, 'User.delete remove error');
							assert.strictEqual(result.deletedCount, 2, 'User.delete did not remove records');

							done();
						}, done)
						.catch(done);
				});

				it('should handle invalid delete queries', function (done) {
					User
						.delete({})
						.then(function (result) {
							assert.deepStrictEqual(result.result, { n: 2, ok: 1 }, 'User.delete remove error');
							assert.strictEqual(result.deletedCount, 2, 'User.delete did not remove records');

							done();
						}, done)
						.catch(done);
				});
			});
		});
	});
});
