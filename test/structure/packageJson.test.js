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
		var packageScripts = packageJSON.scripts;

		it('should exist', function () {
			assert(packageScripts, 'Project scripts are missing!');
		});

		it('should have a start script', function () {
			assert(packageScripts.start, 'Project start script missing');
		});

		it('should have a stop script', function () {
			assert(packageScripts.stop, 'Project stop script missing');
		});

		it('should have a restart script', function () {
			assert(packageScripts.restart, 'Project restart script missing');
		});

		it('should have a docs script', function () {
			assert(packageScripts.docs, 'Project docs script missing');
		});

		it('should have a seed script', function () {
			assert(packageScripts.seed, 'Project seed script missing');
		});

		it('should have a purge script', function () {
			assert(packageScripts.purge, 'Project purge script missing');
		});

		it('should have a lint script', function () {
			assert(packageScripts.lint, 'Project lint script missing');
		});

		it('should have a test script', function () {
			assert(packageScripts.test, 'Project test script missing');
		});

		it('should have a postinstall script', function () {
			assert(packageScripts.postinstall, 'Project postinstall script missing');
		});

		it('should have a pack script', function () {
			assert(packageScripts.pack, 'Project pack script missing');
		});
	});

	describe('contributors', utils.checkContributors(packageJSON.contributors));

	describe('dependencies', utils.checkDependencies(packageJSON));

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
			assert.strictEqual(packageJSON.engines.node, '6.x', 'Project engine is invalid');
		});

		it('should point to a valid npm engine', function () {
			assert.strictEqual(packageJSON.engines.npm, '4.x', 'Project engine is invalid');
		});
	});
});
