/**
 * @file Houses app restart logic in a manner that is both: require and CLI friendly.
 */

var pm2 = require('pm2'),
	async = require('async'),

	pack = require('../misc/pack');

/**
 * Gracefully restarts the app, using a SIGINT to wait for all external resource links to be closed.
 *
 * @param {Function} done - The callback invoked when the app has been restarted.
 */
module.exports = function (done) {
	async.series([
		pack,

		pm2.connect.bind(pm2), // Avoids clutter by not having to wrap this step in a function

		/**
		 * Gracefully reloads the application, also taking care to look for update process.env values.
		 *
		 * @param {Function} next - The callback invoked to mark the end of the graceful reload process.
		 */
		function (next) {
			pm2.gracefulReload('bin/www', { updateEnv: true }, next);
		}
	],

	/**
	 * Detaches from the PM2 daemon, and handles errors, if any.
	 *
	 * @param {?Error} err - An error instance passed from the app restart routine.
	 */
	function (err) {
		pm2.disconnect();
		done(err);
	});
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
