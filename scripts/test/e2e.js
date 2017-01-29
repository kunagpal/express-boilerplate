/**
 * @file Houses require friendly logic for end to end tests.
 */

var path = require('path'),
	run = require(path.join(__dirname, '..', '..', 'utils', 'test')).runTests;

/**
 * Runs tests in the test/e2e directory.
 *
 * @param {Function} done - The callback that marks the end of the e2e test routine.
 */
module.exports = function (done) {
	run('test/e2e', done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
