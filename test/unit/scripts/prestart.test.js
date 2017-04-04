var prestart = require(path.resolve('./scripts/misc/prestart'));

describe('App prestart script', function () {
	var dir = path.resolve('public/min'),
		cleanup = function () {
			try {
				fs // eslint-disable-line lodash/prefer-lodash-method, no-sync
					.readdirSync(dir) // public/min is meant to be a flattened representation of minified assets
					.forEach(function (file) {
						try {
							fs.unlinkSync(path.join(dir, file)); // eslint-disable-line no-sync
						}
						catch (e) {} // eslint-disable-line no-empty
					});
			} catch (e) {} // eslint-disable-line no-empty, brace-style, no-sync
			try { fs.rmdirSync(dir); } catch (e) {} // eslint-disable-line no-empty, brace-style, no-sync
		};

	before(cleanup);
	after(cleanup);

	it('should work correctly', function (done) { // eslint-disable-line mocha/no-exclusive-tests
		prestart(function (err) {
			assert.strictEqual(err, null, `Prestart script failure: ${err}`);

			fs.stat(dir, function (error, stat) {
				assert(stat.isDirectory(), `${dir} is not a valid directory`);
				done(error || err);
			});
		});
	});
});
