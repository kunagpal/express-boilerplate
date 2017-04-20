var url = require('url');

describe('bower', function () {
	var rootPath = path.join(__dirname, '..', '..'),
		bowerJSON = require(path.join(rootPath, 'bower.json')); // eslint-disable-line global-require

	describe('glossary', function () {
		it('should have a name', function () {
			assert.ok(bowerJSON.name, 'Project name is empty / non-existent');
		});

		it('should contain a valid description', function () {
			assert.ok(bowerJSON.description, 'Project description is missing');
		});

		it('should be defined privately', function () {
			assert(bowerJSON.private, true, 'Project may have been public to the npm registry');
		});

		it('should have a non empty list of keywords', function () {
			assert(testUtils.isNonEmptyArray(bowerJSON.keywords), 'Keywords may be invalid!');
		});
	});

	describe('authors', testUtils.checkContributors(bowerJSON.authors));

	// eslint-disable-next-line mocha/no-skipped-tests
	describe.skip('dependencies', testUtils.checkDependencies(bowerJSON, 'bower'));

	it('should point to a valid homepage', function () {
		assert(url.parse(bowerJSON.homepage), 'Project repository url does not point to a valid URL');
	});

	it('should have a valid list of ignored entities', function () {
		assert(testUtils.isNonEmptyArray(bowerJSON.ignore), 'Bower ignores might be invalid');
	});
});
