var makeDocs = require(path.resolve('./scripts/docs/make-docs')),
	makeWiki = require(path.resolve('./scripts/docs/make-wiki'));

describe('Documentation scripts', function () {
	var dir;

	beforeEach(function () { testUtils.clearDir(dir); });
	afterEach(function () { testUtils.clearDir(dir); });

	describe('Documentation generation', function () {
		it('should work correctly', function (done) {
			dir = 'out/docs';

			makeDocs(function (err) {
				var file = `${dir}/index.html`;

				fs.readFile(file, 'utf8', function (error, data) {
					assert(data.length, `Documentation index at ${file} is invalid`);
					done(error || err);
				});
			});
		});
	});

	describe('Wiki generation', function () {
		it('should work correctly', function (done) {
			dir = 'out/wiki';

			makeWiki(function (err) {
				var file = `${dir}/REFERENCE.md`;

				fs.readFile(file, 'utf8', function (error, data) {
					assert(data.length, `Wiki at ${file} is invalid`);
					done(error || err);
				});
			});
		});
	});
});
