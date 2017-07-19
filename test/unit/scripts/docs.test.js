var make = {
	docs: require(path.resolve('./scripts/docs/make-docs')), // eslint-disable-line global-require
	wiki: require(path.resolve('./scripts/docs/make-wiki')) // eslint-disable-line global-require
};

describe('Documentation scripts', function () {
	var dir,
		scopes = [{ name: 'Documentation', file: 'index.html', dir: 'docs' },
			{ name: 'Wiki', file: 'REFERENCE.md', dir: 'wiki' }];

	beforeEach(function () { testUtils.clearDir(dir); });
	afterEach(function () { testUtils.clearDir(dir); });

	scopes.forEach(function (scope) {
		describe(`${scope.name} generation`, function () {
			it('should work correctly', function (done) {
				dir = `out/${scope.dir}`;

				make[scope.dir](function (err) {
					assert(!err, `${scope.name} should be generated correctly`);

					var file = `${dir}/${scope.file}`;

					return fs.readFile(file, 'utf8', function (error, data) {
						assert.strictEqual(error, null, `${scope.name} files should be generated correctly`);
						assert(data.length, `Documentation index at ${file} is invalid`);

						return done();
					});
				});
			});
		});
	});
});
