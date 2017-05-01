#!/usr/bin/env node

/* eslint-disable no-sync */
var path = require('path'),

	chalk = require('chalk'),

	CONFIG_FILE = '.jsdocrc';

/**
 * Generates styled HTML documentation for the project.
 *
 * @param {Function} done - The callback invoked to mark the end of the documentation construction process.
 */
module.exports = function (done) {
	var exitCode = 0;

	// setup
	process.argv.push('-c', CONFIG_FILE);

	try {
		// eslint-disable-next-line global-require
		require(path.resolve('./node_modules/jsdoc/jsdoc'));
	}
	catch (e) {
		exitCode = 1;
		console.error(chalk.red.bold(e));
	}
	finally {
		!exitCode && !module.parent && console.info(chalk.green.bold('Successfully wrote docs to out/docs'));
		done(exitCode);
	}
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(process.exit);
