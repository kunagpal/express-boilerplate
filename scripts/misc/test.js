/**
 * @file Runs unit tests, with code coverage plugged in.
 */

var path = require('path'),

	rootPath = path.join(__dirname, '..', '..'),
	istanbulPath = path.join(rootPath, 'node_modules', 'istanbul'),

	command = require(path.join(istanbulPath, 'lib', 'command')),
	unitTestScript = path.join(rootPath, 'scripts', 'test', 'unit.js');

require(path.join(istanbulPath, 'lib', 'register-plugins'));

/**
 * Runs unit tests for the app.
 *
 * @param {Function} done - The callback that marks the end of the unit tests.
 */
module.exports = function (done) {
	command.create('cover').run([unitTestScript, '--print', 'both', '--colors'], done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
