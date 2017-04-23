#!/usr/local/bin/node

/**
 * @file Houses require friendly logic for dependency security checks using NSP.
 */

var path = require('path'),

	nsp = require('nsp'),
	chalk = require('chalk'),

	packageJson = path.join(__dirname, '..', '..', 'package.json');

/**
 * Runs NSP checks against dependencies in package.json.
 *
 * @param {Function} done - The callback that marks the end of the NSP check.
 */
module.exports = function (done) {
	console.info(chalk.blue.bold('Running security checks with NSP'));
	nsp.check({ offline: false, package: packageJson }, done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
