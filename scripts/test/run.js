#!/usr/bin/env node

/* eslint-disable global-require, no-process-env */
var fs = require('fs'),
	path = require('path'),

	NYC = require('nyc'),
	_ = require('lodash'),
	chalk = require('chalk'),
	async = require('async'),
	Mocha = require('mocha'),
	readDir = require('recursive-readdir'),

	UNIT = 'unit',
	COVERAGE_DIR = '.coverage',
	TEST_FILE_PATTERN = '.test.js',

	root = path.join(__dirname, '..', '..'),
	name = process.env.npm_package_name || require(path.join(root, 'package')).name;

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

	console.info(chalk.blue.bold(`Running ${testDir} tests`));

	process.env.NODE_ENV = 'test';
	process.env.MONGO_URI = `mongodb://127.0.0.1/${name}-test`;
	process.env.SESSION_SECRET = 'randomSecretString';

	var nyc,
		isUnit = testDir === UNIT;

	isUnit && (nyc = new NYC({
		reporter: ['text', 'lcov'],
		reportDir: COVERAGE_DIR,
		tempDirectory: COVERAGE_DIR
	})).wrap();

	return async.waterfall([

		/**
		 * Recursively scans the provided testDir and passes on the files found in it.
		 *
		 * @param {Function} next - The callback that marks the end of the test directory traversal.
		 */
		async.apply(readDir, path.resolve('test', testDir)),

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
				path: path,
				fs: require('fs'),
				assert: require('assert'),
				testUtils: require(path.join(root, 'utils', 'test'))
			});

			mocha.run(next);
		}
	], function (err) {
		if (!isUnit) { return done(err); }

		try {
			fs.mkdirSync(COVERAGE_DIR); // eslint-disable-line no-sync
		}
		catch (e) {} // eslint-disable-line no-empty

		try {
			nyc.writeCoverageFile();
			nyc.report();
			nyc.checkCoverage({
				lines: 60,
				branches: 50,
				functions: 30,
				statements: 60
			});
		}
		catch (e) {
			console.error(e);
		}

		return done(err); // Useful when there are tests to be run after unit tests
	});
};

!module.parent && module.exports(process.exit); // directly call the exported function if used via the CLI
