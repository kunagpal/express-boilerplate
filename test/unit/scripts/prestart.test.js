var prestart = require(path.resolve('./scripts/misc/prestart'));

describe('App prestart script', function () {
	var dir = 'public/min';

	before(function () { testUtils.clearDir(dir); });
	after(function () {	testUtils.clearDir(dir); });

	it('should work correctly', function (done) {
		prestart(function (err) {
			assert.strictEqual(err, null, `Prestart script failure: ${err}`);

			fs.stat(dir, function (error, stat) {
				assert(stat.isDirectory(), `${dir} is not a valid directory`);
				done(error || err);
			});
		});
	});
});
