/**
 * @file Runs unit tests, with code coverage plugged in.
 */

var path = require('path'),

	rootPath = path.join(__dirname, '..', '..'),

	unitTestScript = path.join(rootPath, 'scripts', 'test', 'unit.js'),
	istanbul = require(path.join(rootPath, 'node_modules', 'istanbul', 'lib', 'cli'));

/**
 * Runs unit tests for the app.
 *
 * @param {Function} done - The callback that marks the end of the unit tests.
 */
module.exports = function (done) {
	istanbul.runToCompletion(['cover', unitTestScript, '--print', 'both'], done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
