var async = require('async'),
	ESLint = require('eslint').CLIEngine,

	LINT_SCOPE = ['bin', 'database', 'public/javascripts', 'routes', 'scripts', 'test', 'utils', 'app.js'];

module.exports = function (done) {
	async.waterfall([
		function (next) {
			next(null, new ESLint().executeOnFiles(LINT_SCOPE));
		},
		function (report, next) {
			var errorReport = ESLint.getErrorResults(report.results);

			console.info(ESLint.getFormatter()(report.results));
			next(errorReport && errorReport.length);
		}
	], done);
};

!module.parent && module.exports(process.exit);
