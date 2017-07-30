#!/usr/bin/env node

/**
 * @file Loads the app locally, and exposes a REPL console.
 */

var path = require('path'),
	repl = require('repl'),

	_ = require('lodash'),
	app = require(path.resolve('app'));

module.exports = function () {
	app(function (err) {
		if (err) { throw err; }

		// exposes the current global as a run context for the REPL session
		repl.start({ useGlobal: true }).on('exit', process.exit);
	});
};

!module.parent && module.exports(_);
