describe('User', function () {
	beforeEach(testUtils.db.user);
	afterEach(function (done) {
		testUtils.db.purge(done);
	});

	describe('.updateOne', function () {
		it('should correctly work in shorthand mode', function (done) {
			User.updateOne({
				name: 'Foo Bar'
			}, function (err, result) {
				assert.strictEqual(err, null, 'singular update did not work correctly');
				assert.deepStrictEqual(result.result, { n: 1, nModified: 1, ok: 1 }, 'Error updating one record');
				done();
			});
		});

		it('should result in an error on injection of only arbitrary attributes', function (done) {
			User.updateOne({
				random: 'arbitrary'
			}, function (err) {
				assert(err, 'singular update might have allowed the creation of arbitrary fields');
				assert.strictEqual(err.name, 'MongoError', 'Invalid error');
				done();
			});
		});
	});

	describe('.updateMany', function () {
		it('should correctly work with reduced arguments', function (done) {
			User.updateMany({}, {
				name: 'Foo Bar'
			}, function (err, result) {
				assert.strictEqual(err, null, 'singular update did not work correctly');
				assert.deepStrictEqual(result.result, { n: 1, nModified: 1, ok: 1 }, 'Error updating one record');
				done();
			});
		});

		it('should correctly work in shorthand mode', function (done) {
			User.updateMany({
				name: 'Foo Bar'
			}, function (err, result) {
				assert.strictEqual(err, null, 'singular update did not work correctly');
				assert.deepStrictEqual(result.result, { n: 1, nModified: 1, ok: 1 }, 'Error updating one record');
				done();
			});
		});

		it('should result in an error on the injection of only arbitrary attributes', function (done) {
			User.updateMany({
				random: 'arbitrary'
			}, function (err) {
				assert(err, 'singular update might have allowed the creation of arbitrary fields');
				assert.strictEqual(err.name, 'MongoError', 'Invalid error');
				done();
			});
		});
	});
});
