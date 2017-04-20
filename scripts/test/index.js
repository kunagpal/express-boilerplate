/**
 * @file Houses require friendly logic for app tests.
 */

var path = require('path'),
	cluster = require('cluster'),

	chalk = require('chalk'),
	async = require('async'),
	figlet = require('figlet'),

	e2e = require(path.join(__dirname, 'e2e')),
	esLint = require(path.join(__dirname, 'esLint')),
	security = require(path.join(__dirname, 'security')),
	structure = require(path.join(__dirname, 'structure')),
	unit = require(path.join(__dirname, '..', 'misc', 'test')),

	name = require(path.join(__dirname, '..', '..', 'package')).name;

/**
 * Runs all tests for the app.
 *
 * @param {Function} done - The callback that marks the end of the test suite.
 */
module.exports = function (done) {
	cluster.isMaster && console.info(chalk.yellow.bold(figlet.textSync(name))); // eslint-disable-line no-sync
	async.series([esLint, structure, security, unit, e2e], done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
