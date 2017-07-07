#!/usr/bin/env node

/**
 * @file Houses require friendly logic for lint tests.
 */

var chalk = require('chalk'),
	async = require('async'),
	ESLint = require('eslint').CLIEngine,

	LINT_SCOPE = ['database', 'public/javascripts', 'routes', 'scripts', 'test', 'utils', 'app.js'];

/**
 * Checks project code for style inconsistencies.
 *
 * @param {Function} done - The callback that marks the end of the lint routine.
 */
module.exports = function (done) {
	console.info(chalk.blue.bold('Running code style tests'));

	async.waterfall([

		/**
		 * Runs lint checks on the scope outline in LINT_SCOPE.
		 *
		 * @param {Function} next - The callback that marks the end of the linting process.
		 */
		function (next) {
			next(null, new ESLint().executeOnFiles(LINT_SCOPE));
		},

		/**
		 * Process lint check reports from the previous step in this pipeline.
		 *
		 * @param {Object} report - The result from the lint tests.
		 * @param {Function} next - The callback that marks the end of the post lint check.
		 */
		function (report, next) {
			var errorReport = ESLint.getErrorResults(report.results);

			console.info(ESLint.getFormatter()(report.results));
			next(errorReport && errorReport.length);
		}
	], done);
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
