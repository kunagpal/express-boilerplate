/**
 * @file Houses logic to start the app using pm2.
 */

var pm2 = require('pm2'),
	async = require('async'),

	pack = require('../misc/pack');

/**
 * Starts the app, passing on any errors encountered to the callback.
 *
 * @param {Function} done - The callback invoked to indicate the end of the app star routine.
 */
module.exports = function (done) {
	async.series([
		pack,

		pm2.connect.bind(pm2),

		/**
		 * Starts the app, passing on any errors that are encountered.
		 *
		 * @param {Function} next - The callback invoked to mark the end of the app start routine.
		 */
		function (next) {
			pm2.start({	script: 'bin/www' }, next);
		}
	],

	/**
	 * Disconnects from the PM2 daemon, also handling errors, if any.
	 *
	 * @param {?Error} err - An Error instance passed on from app start.
	 */
	function (err) {
		pm2.disconnect();
		done(err);
	});
};

!module.parent && module.exports(process.exit); // Directly call the exported function if used via the CLI.
