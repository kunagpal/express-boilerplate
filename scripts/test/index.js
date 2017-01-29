/**
 * @file Houses require friendly logic for app tests.
 */

var path = require('path'),

	async = require('async'),

	e2e = require(path.join(__dirname, 'e2e')),
	esLint = require(path.join(__dirname, 'esLint')),
	security = require(path.join(__dirname, 'security')),
	structure = require(path.join(__dirname, 'structure')),
	unit = require(path.join(__dirname, '..', 'misc', 'test'));

/**
 * Runs all tests for the app.
 *
 * @param {Function} done - The callback that marks the end of the test suite.
 */
module.exports = function (done) {
	async.series([esLint, structure, unit, e2e, security], done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
