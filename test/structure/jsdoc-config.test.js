describe('JSDoc configuration', function () {
	var json,
		content,
		jsdocConfigPath = './.jsdocrc';

	it('should exist', function (done) {
		fs.stat(jsdocConfigPath, done);
	});

	it('should have readable content', function () {
		assert(content = fs.readFileSync(jsdocConfigPath).toString(), 'Contents blank!'); // eslint-disable-line no-sync
	});

	it('should have valid JSON content', function () {
		assert(json = JSON.parse(content), 'Content might not be valid JSON!');
	});

	describe('tags', function () {
		it('should allow unkown tags', function () {
			assert(json.tags.allowUnknownTags, 'Unknown tags are disabled');
		});

		it('should have jsdoc and closure dictionaries', function () {
			assert.deepStrictEqual(json.tags.dictionaries, ['jsdoc', 'closure'], 'dictionaries might be invalid!');
		});
	});

	describe('source', function () {
		it('should include relevant project directories', function () {
			assert.deepStrictEqual(json.source.include, ['database', 'routes', 'scripts', 'utils', 'app.js'],
				'Included files may be invalid!');
		});

		it('should have an include pattern', function () {
			assert.strictEqual(json.source.includePattern, '.+\\.js(doc)?$', 'Inclusion pattern is invalid!');
		});

		it('should have an exclude pattern', function () {
			assert.strictEqual(json.source.excludePattern, '(^|\\/|\\\\)_', 'Exclusion pattern is invalid!');
		});
	});

	describe('plugins', function () {
		it('should have the markdown plugin', function () {
			assert(_.includes(json.plugins, 'plugins/markdown'), 'Markdown plugin might be excluded');
		});
	});

	describe('templates', function () {
		it('should not have clever links', function () {
			assert(!json.templates.cleverLinks, 'Clever links might be enabled');
		});

		it('should not have monospace links', function () {
			assert(!json.templates.monospaceLinks, 'Monospace links might be enabled');
		});

		it('should highlight tutorial code', function () {
			assert(json.templates.highlightTutorialCode, 'Tutorial code hightlighting might be turned off');
		});
	});

	describe('opts', function () {
		it('should use a JSDoc theme', function () {
			assert.strictEqual(json.opts.template, './node_modules/ink-docstrap/template', 'Check doc theme!');
		});

		it('should use UTF-8 encoding', function () {
			assert.strictEqual(json.opts.encoding, 'utf8', 'Encoding might be incorrect!');
		});

		it('should create documentation in out/docs', function () {
			assert.strictEqual(json.opts.destination, './out/docs', 'Possible invalid output directory!');
		});

		it('should recurse', function () {
			assert(json.opts.recurse, 'Recursion might not be set!');
		});

		it('should have a valid readme', function () {
			assert.strictEqual(json.opts.readme, 'README.md', 'Invalid README file!');
		});
	});

	describe('markdown', function () {
		it('should have a gfm parser', function () {
			assert.strictEqual(json.markdown.parser, 'gfm', 'GitHub flavoured markdown not set!');
		});

		it('should not use hardwrap', function () {
			assert(!json.markdown.hardwrap, 'Hardwrap might be enabled!');
		});
	});
});
