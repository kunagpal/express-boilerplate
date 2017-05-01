#!/usr/bin/env node

/**
 * @file Runs unit tests, with code coverage plugged in.
 */

var path = require('path'),
	cluster = require('cluster'),

	_ = require('lodash'),
	chalk = require('chalk'),
	async = require('async'),

	rootPath = path.join(__dirname, '..', '..'),
	istanbulPath = path.join(rootPath, 'node_modules', 'istanbul', 'lib'),

	command = require(path.join(istanbulPath, 'command')),
	unitTestScript = path.join(rootPath, 'scripts', 'test', 'unit.js');

require(path.join(istanbulPath, 'register-plugins'));

/**
 * Runs unit tests for the app.
 *
 * @param {Function} done - The callback that marks the end of the unit tests.
 */
module.exports = function (done) {
	async.waterfall([
		function (next) {
			if (cluster.isMaster) {
				cluster.fork();

				cluster.on('exit', function () { // next cannot be passed directly due to signature mismatch
					next();
				});
			}
			else {
				command.create('cover').run([unitTestScript, '--print', 'both', '--colors'], _.noop);
			}
		},
		function (next) {
			command.create('check-coverage').run(['--statements', '70', '--branches', '30', '--functions', '60',
				'--lines', '70'], next);
		}
	], function (err) { // done cannot be passed directly as the default callback might not
		err && console.error(chalk.red(err));
		done(Boolean(err));
	});
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
