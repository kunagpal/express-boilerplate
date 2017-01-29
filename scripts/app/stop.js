/**
 * @file Houses CLI-require friendly logic to stop the app.
 */

var pm2 = require('pm2'),
	async = require('async');

/**
 * Stops the app.
 *
 * @param {Function} done - The callback invoke to indicate that the app has been stopped.
 */
module.exports = function (done) {
	async.series([
		pm2.connect.bind(pm2),

		/**
		 * Performs the actual work of stopping the app.
		 *
		 * @param {Function} next The callback invoked to indicate the app has been stopped.
		 */
		function (next) {
			pm2.stop('bin/www.js', next);
		}
	],

	/**
	 * Disconnects from the pm2 daemon, handling errors, if any.
	 *
	 * @param {?Error} err - An Error instance that contains details on app stop failure, if any.
	 */
	function (err) {
		pm2.disconnect();
		done(err);
	});
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
