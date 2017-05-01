#!/usr/bin/env node

/**
 * @file Houses the bare minimum logic to get unit tests up and running.
 */

var path = require('path'),
	chalk = require('chalk'),

	run = require('./run'),
	rootPath = path.join(__dirname, '..', '..'),
	purge = require(path.join(rootPath, 'scripts', 'database', 'purge'));

/**
 * Runs tests in the test/unit directory, without generating coverage information.
 *
 * @param {Function} done - The callback that marks the end of the unit test routine.
 */
module.exports = function (done) {
	console.info(chalk.blue.bold('Running unit tests'));

	global.purge = purge;
	run('unit', done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
