#!/usr/bin/env node

/* eslint-disable no-sync */
var fs = require('fs'),
	path = require('path'),

	chalk = require('chalk'),

	CONFIG_FILE = '.jsdocrc',

	dirs = ['src', 'util', 'opts'],
	targets = ['app', 'name', 'env', 'src/scanner', 'util/logger', 'opts/args', 'fs', 'path', 'readme'];

module.exports = function (done) {
	var exitCode = 0;

	// setup
	process.argv.push('-c', CONFIG_FILE);
	require.main.paths.push(path.resolve('./node_modules/jsdoc/'));
	process.chdir('./node_modules/');

	dirs.forEach(function (directory) {
		try {
			fs.mkdirSync(`jsdoc/${directory}`);
		}
		catch (e) {} // eslint-disable-line no-empty
	});

	targets.forEach(function (target) {
		try {
			fs.symlinkSync(path.resolve(`./jsdoc/lib/jsdoc/${target}.js`), `./jsdoc/${target}`);
		}
		catch (e) {} // eslint-disable-line no-empty
	});

	process.chdir('..');

	try {
		require(path.resolve('./node_modules/jsdoc/jsdoc.js'));
	}
	catch (e) {
		exitCode = 1;
		console.error(chalk.red.bold(e));
	}
	finally {
		// cleanup
		targets.forEach(function (target) {
			try {
				fs.unlinkSync(path.resolve(`./jsdoc/${target}`));
			}
			catch (e) {} // eslint-disable-line no-empty
		});

		dirs.forEach(function (directory) {
			try {
				fs.rmdirSync(`jsdoc/${directory}`);
			}
			catch (e) {} // eslint-disable-line no-empty
		});

		require.main.paths.pop();
		!exitCode && !module.parent && console.info(chalk.green.bold('Successfully wrote docs to out/docs'));

		done(exitCode);
	}
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(process.exit);
