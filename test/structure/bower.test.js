var url = require('url'),
	path = require('path'),
	assert = require('assert'),

	_ = require('lodash'),

	utils = require(path.join(__dirname, '..', '..', 'utils', 'test'));

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
			assert(_.isArray(bowerJSON.keywords) && !_.isEmpty(bowerJSON.keywords),
                'Project may have been public to the npm registry');
		});
	});

	describe('authors', utils.checkContributors(bowerJSON.authors));

	// eslint-disable-next-line mocha/no-skipped-tests
	describe.skip('dependencies', utils.checkDependencies(bowerJSON, 'bower'));

	it('should point to a valid homepage', function () {
		assert(url.parse(bowerJSON.homepage), 'Project repository url does not point to a valid URL');
	});

	it('should have a valid list of ignored entities', function () {
		assert(_.isArray(bowerJSON.ignore) && !_.isEmpty(bowerJSON.ignore), 'Bower ignores might be invalid');
	});
});
