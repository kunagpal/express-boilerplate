#!/usr/bin/env node

/**
 * @file Houses require friendly logic for the CSS Lint tests
 */

var path = require('path'),

	CSS_DIR = 'public/stylesheets';

/**
 * Runs CSSLint tests on the specified directory.
 *
 * @param {Function} done - The callback invoked to mark the end of the CSS linting process.
 */
module.exports = function (done) {
	process.argv.push(CSS_DIR);

	// override the exit handler just for this sequence
	process.exit = done;

	// eslint-disable-next-line global-require
	require(path.resolve('./node_modules/csslint/dist/cli'));
};

!module.parent && module.exports(process.exit);
