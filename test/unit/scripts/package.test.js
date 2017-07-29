var rm = require('shelljs').rm,
	archive = require(path.resolve('./scripts/package/archive'));

describe('Package scripts', function () {
	var dir = 'out/archive';

	beforeEach(function () { rm('-rf', dir); });
	afterEach(function () {	rm('-rf', dir); });

	it('should archive the project correctly', function (done) {
		archive(function (err) {
			assert.strictEqual(err, null, `Archive script failure: ${err}`);

			fs.readdirSync(dir).forEach(function (file) { // eslint-disable-line no-sync
				assert(fs.statSync(path.join(dir, file)).isFile()); // eslint-disable-line no-sync
			});

			done();
		});
	});
});
