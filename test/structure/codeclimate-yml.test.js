var fs = require('fs'),
	path = require('path'),
	assert = require('assert'),

	_ = require('lodash'),
	utils = require(path.join(__dirname, '..', '..', 'utils', 'test')),

	CODECLIMATE_PATH = '.codeclimate.yml';

describe(CODECLIMATE_PATH, function () {
	var codeClimateYAML = utils.ymlToJson(CODECLIMATE_PATH);

	it('should exist', function (done) {
		fs.stat(CODECLIMATE_PATH, done);
	});

	it('should have the csslint engine enabled', function () {
		assert(codeClimateYAML.engines.csslint.enabled, 'CSSLint config missing / broken');
	});

	it('should have the duplication engine enabled', function () {
		var duplicationEngine = codeClimateYAML.engines.duplication;

		assert(duplicationEngine.enabled, 'Duplication config missing / broken');
		assert.strictEqual(_.head(duplicationEngine.config.languages), 'javascript', 'Invalid language setting');
	});

	it('should have the ESLint engine enabled', function () {
		assert(codeClimateYAML.engines.eslint.enabled, 'ESLint config missing / broken');
	});

	it('should have the Fixme engine enabled', function () {
		assert(codeClimateYAML.engines.fixme.enabled, 'Fixme config missing / broken');
	});

	it('should have the MarkdownLint engine enabled', function () {
		assert(codeClimateYAML.engines.markdownlint.enabled, 'MarkdownLint config missing / broken');
	});

	it('should have a valid ratings structure', function () {
		assert.deepStrictEqual(codeClimateYAML.ratings.paths, ['**.css', '**.js', '**.md', 'bin/**/*'],
            'Missing / invalid rating paths');
	});

	it('should have a field ratings, as an array', function () {
		assert(_.isArray(codeClimateYAML.exclude_paths), 'Exclude paths is either missing or is in invalid format');
	});
});
