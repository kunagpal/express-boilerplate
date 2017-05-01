#!/usr/bin/env node

/**
 * @file Houses require friendly logic for app tests.
 */

var path = require('path'),
	cluster = require('cluster'),

	chalk = require('chalk'),
	async = require('async'),
	figlet = require('figlet'),

	run = require('./run'),

	esLint = require(path.join(__dirname, 'esLint')),
	cssLint = require(path.join(__dirname, 'cssLint')),
	security = require(path.join(__dirname, 'security')),
	unit = require(path.join(__dirname, '..', 'misc', 'test')),

	// eslint-disable-next-line global-require, no-process-env
	name = process.env.npm_package_name || require(path.join(__dirname, '..', '..', 'package')).name;

/**
 * Runs all tests for the app. The apparent unit test duplication below is due to the code coverage generation being
 * done within a worker process.
 *
 * @param {Function} done - The callback that marks the end of the test suite.
 */
module.exports = function (done) {
	if (cluster.isMaster) {
		console.info(chalk.yellow.bold(figlet.textSync(name))); // eslint-disable-line no-sync
		async.series([esLint, cssLint, async.apply(run, 'structure'), security, unit, async.apply(run, 'e2e')], done);
	}
	else {
		unit(done);
	}
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
