var load = require('require-all'),

	database = load(path.resolve('./scripts/database'));

describe('Database scripts', function () {
	describe('purge', function () {
		it('should purge the database correctly', function (done) {
			database.purge(function (err) {
				assert.strictEqual(!err, true, `Purge script failure: ${err}`);
				done();
			});
		});
	});
});
