var rm = require('shelljs').rm,
	pack = require(path.resolve('./scripts/misc/pack'));

describe('App prestart script', function () {
	var dir = 'public/min';

	before(function () { rm('-rf', dir); });
	after(function (done) {
		rm('-rf', dir);
		pack(done); // restore minified static assets so that sanity tests work correctly
	});

	it('should work correctly', function (done) {
		pack(function (err) {
			assert.strictEqual(err, null, `Prestart script failure: ${err}`);

			fs.stat(dir, function (error, stat) {
				assert(stat.isDirectory(), `${dir} is not a valid directory`);
				done(error || err);
			});
		});
	});
});
