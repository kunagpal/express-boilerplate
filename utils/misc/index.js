/**
* @file Contains miscellaneous helpers used throughout the project.
*/

var _ = require('lodash'),

	reject = Promise.reject.bind(Promise),

	REQUIRED_VARS = ['GOOGLE_ID', 'GOOGLE_KEY', 'FACEBOOK_ID', 'FACEBOOK_KEY', 'COOKIE_SECRET', 'SESSION_SECRET',
		'SENTRY_DSN', 'MONGO_URI', 'PORT'];

/**
* Checks for environment sanity right before the app starts.
*/
exports.checkVars = function () {
	var subset = _(process.env).pick(REQUIRED_VARS).keys().value(),
		missingVars = _.difference(REQUIRED_VARS, subset).toString();

	if (!_.isEmpty(missingVars)) {
		throw new Error(`${missingVars.toString()} environment variables are missing!`);
	}
};

/**
 * Handles the provided error meta with either the provided callback, or a Promise.reject.
 *
 * @param {Error|String} err - An error instance, or the message to be passed down.
 * @param {Function} callback - The function to handle the error with.
 * @returns {Promise|*} - A rejected promise instance, or a callback stub associated with the current error context.
 */
exports.handle = function (err, callback) {
	return (_.isFunction(callback) ? callback : reject)(_.isError(err) ? err : new Error(err));
};
