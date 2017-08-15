var CODECLIMATE_PATH = '.codeclimate.yml';

describe(CODECLIMATE_PATH, function () {
	var codeClimateYAML = testUtils.ymlToJson(CODECLIMATE_PATH);

	it('should exist', function (done) {
		fs.stat(CODECLIMATE_PATH, done);
	});

	it('should have the csslint engine enabled', function () {
		assert(codeClimateYAML.engines.csslint.enabled, 'CSSLint config missing / broken');
	});

	it('should have the duplication engine enabled', function () {
		var duplicationEngine = codeClimateYAML.engines.duplication;

		assert(duplicationEngine.enabled, 'Duplication config missing / broken');
		assert.deepStrictEqual(duplicationEngine.exclude_paths, ['test/**/*'], 'Test suite should be ignored');
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
		assert(!codeClimateYAML.engines.markdownlint.checks.MD013.enabled, 'MarkdownLint must skip line length');
		assert(!codeClimateYAML.engines.markdownlint.checks.MD029.enabled, 'MarkdownLint must skip list prefix');
	});

	it('should have a valid ratings structure', function () {
		assert.deepStrictEqual(codeClimateYAML.ratings.paths, ['**.css', '**.js', '**.md', 'bin/**/*'],
			'Missing / invalid rating paths');
	});

	it('should have a field ratings, as an array', function () {
		assert.deepStrictEqual(codeClimateYAML.exclude_paths, ['Procfile', 'LICENSE', '**.ejs', '**.yml', '**.opts'],
			'Exclude paths is either missing or is in invalid format');
	});
});
