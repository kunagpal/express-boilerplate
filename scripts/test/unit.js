#!/usr/bin/env node

/**
 * @file Houses the bare minimum logic to get unit tests up and running.
 */

/* eslint-disable no-process-env */
var path = require('path'),
	chalk = require('chalk'),

	run = require('./run'),
	rootPath = path.join(__dirname, '..', '..'),
	purge = require(path.join(rootPath, 'scripts', 'database', 'purge')),

	// eslint-disable-next-line global-require
	name = process.env.npm_package_name || require(path.join(__dirname, '..', '..', 'package')).name;

/**
 * Runs tests in the test/unit directory, without generating coverage information.
 *
 * @param {Function} done - The callback that marks the end of the unit test routine.
 */
module.exports = function (done) {
	console.info(chalk.blue.bold('Running unit tests'));

	global.purge = purge;
	process.env.NODE_ENV = 'test';
	process.env.MONGO_URI = `mongodb://127.0.0.1/${name}-test`;
	process.env.SESSION_SECRET = 'randomSecretString';

	run('unit', done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
