#!/usr/bin/env node

/**
 * @file Houses logic to start the app using pm2.
 */

var pm2 = require('pm2'),
	_ = require('lodash'),
	async = require('async');

/**
 * Starts the app, passing on any errors encountered to the callback.
 *
 * @param {?Object} [options={}] - The options to launch the pm2 daemon with.
 * @param {Function} done - The callback invoked to indicate the end of the app start routine.
 */
module.exports = function (options, done) {
	_.isFunction(options) && (done = options) && (options = {});

	async.series([

		pm2.connect.bind(pm2),

		/**
		 * Starts the app, passing on any errors that are encountered.
		 *
		 * @param {Function} next - The callback invoked to mark the end of the app start routine.
		 */
		async.apply(pm2.start.bind(pm2), _.defaults(options, { script: 'app.js' }))
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
