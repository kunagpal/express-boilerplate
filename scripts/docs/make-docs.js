#!/usr/bin/env node

var fs = require('fs'),
	path = require('path'),

	dirs = ['src', 'util', 'opts'],
	targets = ['app', 'name', 'env', 'src/scanner', 'util/logger', 'opts/args', 'fs', 'path', 'readme'];

module.exports = function (done) {
	// setup
	require.main.paths.push(path.resolve('./node_modules/jsdoc/'));
	process.chdir('./node_modules/');

	dirs.forEach(function (directory) {
		fs.mkdirSync(`jsdoc/${directory}`); // eslint-disable-line no-sync
	});

	targets.forEach(function (target) {
		try {
			// eslint-disable-next-line no-sync
			fs.symlinkSync(path.resolve(`./jsdoc/lib/jsdoc/${target}.js`), `./jsdoc/${target}`);
		}
		catch (e) {} // eslint-disable-line no-empty
	});

	// require(path.resolve('./jsdoc/lib/jsdoc/util/runtime')).initialize([path.resolve('./jsdoc'),
	//	path.join(__dirname, '..', '..')]);

	// @todo: Figure out how to make this accept arguments
	require(path.resolve('./jsdoc/jsdoc.js'));

	// cleanup
	targets.forEach(function (target) {
		try {
			fs.unlinkSync(path.resolve(`./jsdoc/${target}`)); // eslint-disable-line no-sync
		}
		catch (e) {} // eslint-disable-line no-empty
	});

	dirs.forEach(function (directory) {
		fs.rmdirSync(`jsdoc/${directory}`); // eslint-disable-line no-sync
	});

	require.main.paths.pop();
	process.chdir('..');
	done();
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(process.exit);
