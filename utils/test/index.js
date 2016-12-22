var fs = require('fs'),
	path = require('path'),
	assert = require('assert'),

	_ = require('lodash'),
	yaml = require('js-yaml'),

	ENCODING = 'utf-8',
	YAML_LOAD_ERROR = 'The specified file does not exist, or is invalid YAML',
	PACKAGES = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'bundledDependencies'];

exports.ymlToJson = function (yamlPath) {
	var json = {};

	try {
		json = yaml.safeLoad(fs.readFileSync(yamlPath, ENCODING)); // eslint-disable-line no-sync
	}
	catch (err) {
		console.error(YAML_LOAD_ERROR);
	}

	return json;
};

exports.checkContributors = function (contributors) {
	return function () {
		it('should exist and be an array', function () {
			assert(_.isArray(contributors), 'Project contributor details missing / in non array form');
		});

		it('should have a non-zero length', function () {
			assert(!_.isEmpty(contributors), 'Project contributors section is empty');
		});

		it('should contain valid contributor details', function () {
			_.forEach(contributors, function (contributor, index) {
				assert(contributor.name, `Project contributor ${index} name missing`);
				assert(/@.+\./i.test(contributor.email), `Project contributor ${index} email invalid`);
			});
		});
	};
};

exports.checkDependencies = function (package, mode) {
	mode = mode || 'package';
	var packageDependencies = _.pick(package, PACKAGES);

	return function () {
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

		it('should have the same versions across package.json and node_modules', function () {
			var isBower = mode === 'bower',
				dependencyPath = path.join(__dirname, '..', '..', isBower ? path.join('public', 'bower')
					: 'node_modules');

			_.forEach(packageDependencies, function (dependencies) {
				_.forEach(dependencies, function (specified, dependency) {
					if (isBower || dependency !== 'bcrypt') {
						// eslint-disable-next-line global-require
						var installed = require(path.join(dependencyPath, dependency, 'package.json')).version;

						assert.strictEqual(specified, installed, `Need ${dependency} ${specified}, found ${installed}`);
					}
				});
			});
		});
	};
};
