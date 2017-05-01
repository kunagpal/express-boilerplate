#!/usr/bin/env node

var path = require('path'),

	_ = require('lodash'),
	chalk = require('chalk'),
	async = require('async'),
	Mocha = require('mocha'),
	cluster = require('cluster'),
	readDir = require('recursive-readdir'),

	TEST_FILE_PATTERN = 'test.js',

	root = path.join(__dirname, '..', '..');

/**
 * Runs tests from a given directory.
 *
 * @param {?String} testDir - The directory to run tests from.
 * @param {Function} done - THe callback that indicates the end of the test run.
 * @returns {*} - A callback stub for erroneous cases.
 */
module.exports = function (testDir, done) {
	_.isFunction(testDir) && (done = testDir) && (testDir = process.argv.splice(2)[0]);

	if (!testDir) {
		return done(new Error('A valid test directory is required'));
	}

	cluster.isMaster && console.info(chalk.blue.bold(`Running ${testDir} tests`));

	async.waterfall([

		/**
		 * Recursively scans the provided testDir and passes on the files found in it.
		 *
		 * @param {Function} next - The callback that marks the end of the test directory traversal.
		 */
		function (next) {
			readDir(path.resolve('test', testDir), next);
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
		 * @param {String[]} tests - The filtered test files from testDir.
		 * @param {Function} next - The callback that marks the end of the test instance compilation.
		 */
		function (tests, next) {
			var mocha = new Mocha({ timeout: 5000 });

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
			_.assign(global, {
				_: _,
				fs: require('fs'), // eslint-disable-line global-require
				path: path,
				assert: require('assert'), // eslint-disable-line global-require
				testUtils: require(path.join(root, 'utils', 'test')) // eslint-disable-line global-require
			});

			mocha.run(next);
		}
	], done);
};

!module.parent && module.exports(process.exit); // directly call the exported function if used via the CLI
