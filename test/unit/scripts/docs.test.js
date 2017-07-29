var rm = require('shelljs').rm,
	makeWiki = require(path.resolve('./scripts/docs/make-wiki'));

// JSDoc generation can't be tested without using cluster as it kills the process after generating docs.
describe('Documentation scripts', function () {
	beforeEach(function () { rm('-rf', 'out'); });
	afterEach(function () { rm('-rf', 'out'); });

	it('should generate the wiki correctly', function (done) {
		makeWiki(function (err) {
			assert(!err, 'Wiki generation failed');

			// eslint-disable-next-line no-sync
			assert(fs.readFileSync('out/wiki/REFERENCE.md', 'utf8').length, 'Invalid wiki file');

			done();
		});
	});
});
