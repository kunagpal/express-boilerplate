var url = require('url');

describe('package.json', function () {
	var rootPath = path.join(__dirname, '..', '..'),
		packageJSON = require(path.join(rootPath, 'package.json')); // eslint-disable-line global-require

	describe('glossary', function () {
		it('should have a name', function () {
			assert.ok(packageJSON.name, 'Project name is empty / non-existent');
		});

		it('should point to a valid, precise version', function () {
			assert.ok(/^\d/.test(packageJSON.version), 'Project version may start with ^ / ~');
		});

		it('should contain a valid description', function () {
			assert.ok(packageJSON.description, 'Project description is missing');
		});

		it('should be defined privately', function () {
			assert(packageJSON.private, true, 'Project may have been public to the npm registry');
		});
	});

	describe('scripts', function () {
		var packageScripts = packageJSON.scripts,
			scripts = ['archive', 'check', 'make-wiki', 'make-docs', 'start', 'stop', 'seed', 'csslint', 'eslint',
				'lint', 'unit', 'e2e', 'structure', 'test', 'prestart', 'postinstall'];

		it('should exist', function () {
			assert(packageScripts, 'Project scripts are missing!');
		});

		scripts.forEach(function (script) {
			assert(packageScripts[script], `Project ${script} script missing!`);
		});
	});

	describe('dependencies', testUtils.checkDependencies(packageJSON));

	describe('repository', function () {
		var packageRepository = packageJSON.repository;

		it('should exist and be an object', function () {
			assert(_.isPlainObject(packageRepository), 'Project repository details missing / in non object form');
		});

		it('should have a type git', function () {
			assert.strictEqual(packageRepository.type, 'git', 'Project repository is of a non-git type');
		});

		it('should point to a valid URL', function () {
			assert(url.parse(packageRepository.url), 'Project repository url does not point to a valid URL');
		});
	});

	describe('engine', function () {
		it('should point to a valid node engine', function () {
			assert.strictEqual(packageJSON.engines.node, '>=4.8.0', 'Project engine is invalid');
		});

		it('should point to a valid npm engine', function () {
			assert.strictEqual(packageJSON.engines.npm, '>=2.15.0', 'Project engine is invalid');
		});
	});
});
