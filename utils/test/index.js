/**
 * @file Contains re-usable test helpers.
 */

/* globals it */
var fs = require('fs'),
	path = require('path'),
	assert = require('assert'),

	_ = require('lodash'),
	yaml = require('js-yaml'),

	ENCODING = 'utf-8',
	PACKAGES = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'bundledDependencies'];

/**
 * Checks whether the provided object is a non-empty array.
 *
 * @param {*} arr - The object to be checked.
 * @returns {Boolean} - A flag to indicate that the provided object is a non-empty array.
 */
exports.isNonEmptyArray = function (arr) {
	return _.isArray(arr) && !_.isEmpty(arr);
};

/**
 * Converts YAMl to JSON.
 *
 * @param {String} yamlPath - The path of the file to parse YAMl from.
 * @returns {Object} The JSON representation of the provided YAML file.
 */
exports.ymlToJson = function (yamlPath) {
	var json = {};

	try {
		json = yaml.safeLoad(fs.readFileSync(yamlPath, ENCODING)); // eslint-disable-line no-sync
	}
	catch (err) {} // eslint-disable-line no-empty

	return json;
};

exports.clearDir = function (dir) {
	try {
		fs // eslint-disable-line no-sync
			.readdirSync(dir) // public/min is meant to be a flattened representation of minified assets
			.forEach(function (file) {
				try {
					fs.unlinkSync(path.join(dir, file)); // eslint-disable-line no-sync
				}
				catch (e) {} // eslint-disable-line no-empty
			});
	} catch (e) {} // eslint-disable-line no-empty, brace-style, no-sync
	try { fs.rmdirSync(dir); } catch (e) {} // eslint-disable-line no-empty, brace-style, no-sync
};

/**
 * Checks the provided contributors object for sanity.
 *
 * @param {Object[]} contributors - A set of contributor details.
 * @returns {Function} A test suite related to package contributor checks.
 */
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

/**
 * Creates and returns a test suite to check dependencies.
 *
 * @param {Object} packageJson - The package manifest to process.
 * @param {?String} [mode=package] - The type of package to process.
 * @returns {Function} The test suite for the given set of conditions.
 */
exports.checkDependencies = function (packageJson, mode) {
	mode = mode || 'package';
	var packageDependencies = _.pick(packageJson, PACKAGES);

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
