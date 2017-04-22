var makeDocs = require(path.resolve('./scripts/docs/make-docs')),
	makeWiki = require(path.resolve('./scripts/docs/make-wiki'));

describe('Documentation scripts', function () {
	describe('Documentation generation', function () {
		var dir = 'out/docs';

		before(function () { testUtils.clearDir(dir); });
		after(function () { testUtils.clearDir(dir); });

		it('should work correctly', function (done) {
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
		var dir = 'out/wiki';

		before(function () { testUtils.clearDir(dir); });
		after(function () { testUtils.clearDir(dir); });

		it('should work correctly', function (done) {
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
