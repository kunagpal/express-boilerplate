/**
 * @file Houses the bare minimum logic to get unit tests up and running.
 */

var path = require('path'),
	chalk = require('chalk'),

	run = require(path.join(__dirname, '..', '..', 'utils', 'test')).runTests;

/**
 * Runs tests in the test/unit directory, without generating coverage information.
 *
 * @param {Function} done - The callback that marks the end of the unit test routine.
 */
module.exports = function (done) {
	console.info(chalk.blue.bold('Running unit tests'));
	run('test/unit', done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
