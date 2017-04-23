#!/usr/local/bin/node

/**
 * @file Houses require friendly logic for end to end tests.
 */

var path = require('path'),
	chalk = require('chalk'),

	run = require(path.join(__dirname, '..', '..', 'utils', 'test')).runTests;

/**
 * Runs tests in the test/e2e directory.
 *
 * @param {Function} done - The callback that marks the end of the e2e test routine.
 */
module.exports = function (done) {
	console.info(chalk.blue.bold('Running end to end tests'));
	run('test/e2e', done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
