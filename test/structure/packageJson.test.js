var url = require('url'),
	path = require('path'),
	assert = require('assert'),

	_ = require('lodash'),
	packageJSON = require(path.join(__dirname, '..', '..', 'package.json'));

describe('package.json', function () {
	describe('glossary', function () {
		it('must have a name', function () {
			assert.ok(_.get(packageJSON, 'name'), 'Project name is empty / non-existent');
		});

		it('must point to a valid, precise version', function () {
			assert.ok(/^\d/.test(_.get(packageJSON, 'version')), 'Project version is invalid');
		});

		it('must contain a valid description', function () {
			assert.ok(_.get(packageJSON, 'description'), 'Project description is missing');
		});

		it('must be defined privately', function () {
			assert(_.get(packageJSON, 'private'), true, 'Project may have been public to the npm registry');
		});
	});

	describe('scripts', function () {
		var packageScripts = _.get(packageJSON, 'scripts', false);

		it('must exist', function () {
			assert(packageScripts, 'Project scripts are missing!');
		});

		it('must have a start script', function () {
			assert(_.get(packageScripts, 'start'), 'Project start script missing');
		});

		it('must have a stop script', function () {
			assert(_.get(packageScripts, 'stop'), 'Project stop script missing');
		});

		it('must have a restart script', function () {
			assert(_.get(packageScripts, 'restart'), 'Project restart script missing');
		});

		it('must have a docs script', function () {
			assert(_.get(packageScripts, 'docs'), 'Project docs script missing');
		});

		it('must have a seed script', function () {
			assert(_.get(packageScripts, 'seed'), 'Project seed script missing');
		});

		it('must have a purge script', function () {
			assert(_.get(packageScripts, 'purge'), 'Project purge script missing');
		});

		it('must have a lint script', function () {
			assert(_.get(packageScripts, 'test-lint'), 'Project lint script missing');
		});

		it('must have a test script', function () {
			assert(_.get(packageScripts, 'test'), 'Project test script missing');
		});

		it('must have a security check script', function () {
			assert(_.get(packageScripts, 'security'), 'Project security script missing');
		});

		it('must have a postinstall script', function () {
			assert(_.get(packageScripts, 'postinstall'), 'Project postinstall script missing');
		});
	});

	describe('contributors', function () {
		var packageContributors = _.get(packageJSON, 'contributors');

		it('should exist and be an array', function () {
			assert(_.isArray(packageContributors), 'Project contributor details missing / in non array form');
		});

		it('should have a non-zero length', function () {
			assert(packageContributors.length > 0, 'Project contributors section is empty');
		});

		it('should contain valid contributor details', function () {
			_.forEach(packageContributors, function (contributor, index) {
				assert(_.get(contributor, 'name'), `Project contributor ${index} name missing`);
				assert(/@.+\./i.test(_.get(contributor, 'email')), `Project contributor ${index} email invalid`);
			});
		});
	});

	describe('dependencies', function () {
		var packageDependencies = _.pick(packageJSON, ['dependencies', 'devDependencies', 'optionalDependencies']);

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

		it('specified and installed versions should match', function () {
			var dependencies = _.merge({}, _.get(packageDependencies, 'dependencies', {}),
			_.get(packageDependencies, 'devDependencies', {}), _.get(packageDependencies, 'optionalDependencies', {}),
			_.get(packageDependencies, 'peerDependencies', {}));

			_.forEach(dependencies, function (specifiedVersion, dependency) {
				var installationPath = path.join(__dirname, '..', '..', 'node_modules', dependency, 'package.json'),
					installedVersion = require(installationPath).version;

				assert(specifiedVersion === installedVersion,
					`${dependency} is specified as ${specifiedVersion}, but installed as ${installedVersion}`);
			});
		});
	});

	describe('repository', function () {
		var packageRepository = _.get(packageJSON, 'repository');

		it('should exist and be an object', function () {
			assert(_.isPlainObject(packageRepository), 'Project repository details missing / in non object form');
		});

		it('should have a type git', function () {
			assert(_.get(packageRepository, 'type') === 'git', 'Project repository is of a non-git type');
		});

		it('should point to a valid URL', function () {
			assert(url.parse(_.get(packageRepository, 'url')), 'Project repository url does not point to a valid URL');
		});
	});

	describe('engine', function () {
		it('must point to a valid engine', function () {
			assert(_.get(packageJSON, 'engines.node'), 'Project engine is invalid');
		});
	});
});
