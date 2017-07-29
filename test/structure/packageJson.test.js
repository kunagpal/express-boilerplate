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
				'lint', 'unit', 'e2e', 'structure', 'test', 'pack', 'postinstall'];

		it('should exist', function () {
			assert(packageScripts, 'Project scripts are missing!');
		});

		scripts.forEach(function (script) {
			// eslint-disable-next-line security/detect-object-injection
			assert(packageScripts[script], `Project ${script} script missing!`);
		});
	});

	describe('dependencies', function () {
		var packageDependencies = _.pick(packageJSON,
			['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'bundledDependencies']);

		it('should exist and be an object', function () {
			assert(!_.isEmpty(packageDependencies) && _.isObject(packageDependencies), 'Project has no dependencies');
		});

		it('should have precise dependency versions', function () {
			_.forEach(packageDependencies, function (dependencies, type) {
				_.forEach(dependencies, function (version, name) {
					assert(/^\d/.test(version), `${type}: ${name}@${version} is invalid`);
				});
			});
		});

		it('should be mutually exclusive', function () {
			var intersection = [];

			_.forEach(packageDependencies, function (packages) {
				intersection = _.intersection(intersection, Object.keys(packages));
			});

			assert.deepStrictEqual(intersection, [], `The dependencies ${intersection.join(', ')} are duplicated`);
		});

		it('should have the same versions across package.json and node_modules', function () {
			var present = {},
				required = {},
				isWindows = process.platform === 'win32',
				dependencyPath = path.join(path.resolve('node_modules'));

			_.forEach(packageDependencies, function (dependencies) {
				required = _.assign(required, dependencies);

				_.forEach(dependencies, function (specified, dependency) {
					if (!(dependency === 'bcrypt' && isWindows)) {
						// eslint-disable-next-line global-require
						var installed = require(path.join(dependencyPath, dependency, 'package.json')).version;

						present[dependency] = installed; // eslint-disable-line security/detect-object-injection
					}
				});
			});

			assert.deepStrictEqual(_.omit(required, isWindows && 'bcrypt'), present,
				'The specified and present dependency versions are different!');
		});
	});

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
