/**
 * @file Houses require friendly logic for structural tests.
 */

var path = require('path'),
	run = require(path.join(__dirname, '..', '..', 'utils', 'test')).runTests;

/**
 * Runs structural sanity tests on the application.
 *
 * @param {Function} done - The callback that marks the end of the structural tests.
 */
module.exports = function (done) {
	run('test/structure', done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
