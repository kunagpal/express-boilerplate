/**
 * @file Runs unit tests, with code coverage plugged in.
 */

var path = require('path'),

	async = require('async'),

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
	async.waterfall([
		function (next) {
			command.create('cover').run([unitTestScript, '--print', 'both', '--colors'], next);
		},
		function (data, next) {
			command.create('check-coverage').run(['--statements', '80', '--functions', '70', '--lines', '80',
				'--branches', '75'], next);
		}
	], done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
