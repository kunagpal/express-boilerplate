var make = {
	docs: require(path.resolve('./scripts/docs/make-docs')), // eslint-disable-line global-require
	wiki: require(path.resolve('./scripts/docs/make-wiki')) // eslint-disable-line global-require
};

describe('Documentation scripts', function () {
	var dir;

	beforeEach(function () { testUtils.clearDir(dir); });
	afterEach(function () { testUtils.clearDir(dir); });

	describe('Wiki generation', function () {
		it('should work correctly', function (done) {
			dir = 'out/wiki';

			make.wiki(function (err) {
				if (err) { return done(err); }

				var file = `${dir}/REFERENCE.md`;

				return fs.readFile(file, 'utf8', function (error, data) {
					if (error) { return done(error); }

					assert(data.length, `Documentation index at ${file} is invalid`);

					return done();
				});
			});
		});
	});
});
