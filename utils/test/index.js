/**
 * @file Contains re-usable test helpers.
 */

/* globals it */
var fs = require('fs'),
	path = require('path'),
	assert = require('assert'),

	_ = require('lodash'),
	async = require('async'),
	Mocha = require('mocha'),
	yaml = require('js-yaml'),
	readDir = require('recursive-readdir'),

	ENCODING = 'utf-8',
	TEST_FILE_PATTERN = '.test.js',
	YAML_LOAD_ERROR = 'The specified file does not exist, or is invalid YAML',
	PACKAGES = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'bundledDependencies'];

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
	catch (err) {
		console.error(YAML_LOAD_ERROR);
	}

	return json;
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

/**
 * Runs tests from a given directory.
 *
 * @param {?String} testDir - The directory to run tests from.
 * @param {Function} done - THe callback that indicates the end of the test run.
 */
exports.runTests = function (testDir, done) {
	async.waterfall([

		/**
		 * Recursively scans the provided testDir and passes on the files found in it.
		 *
		 * @param {Function} next - The callback that marks the end of the test directory traversal.
		 */
		function (next) {
			readDir(testDir, next);
		},

		/**
		 * Picks files matching TEST_FILE_PATTERN and passes them on.
		 *
		 * @param {String[]} files - The list of file paths picked from the testDir directory.
		 * @param {Function} next - The callback that marks the end of the file picking routine.
		 */
		function (files, next) {
			next(null, _.filter(files, function (file) {
				return _.endsWith(file, TEST_FILE_PATTERN);
			}));
		},

		/**
		 * Dynamically constructs a test suite instance for the current run.
		 *
		 * @param {String[]] tests - The filtered test files from testDir.
		 * @param {Function} next - The callback that marks the end of the test instance compilation.
		 */
		function (tests, next) {
			var mocha = new Mocha();

			_.forEach(tests, mocha.addFile.bind(mocha));

			next(null, mocha);
		},

		/**
		 * Runs tests from the provided test suite instance.
		 *
		 * @param {Mocha} mocha - The test suite instance used to trigger the tests.
		 * @param {Function} next - The callback that marks the end of the test run.
		 */
		function (mocha, next) {
			_.merge(global, {
				_: _,
				fs: fs,
				path: path,
				assert: assert,
				utils: exports
			});

			mocha.run(next);
		}
	], done);
};
