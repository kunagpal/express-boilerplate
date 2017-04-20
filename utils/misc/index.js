/**
* @file Contains miscellaneous helpers used throughout the project.
*/

var REQUIRED_VARS = ['GOOGLE_ID', 'GOOGLE_KEY', 'FACEBOOK_ID', 'FACEBOOK_KEY', 'COOKIE_SECRET', 'SESSION_SECRET',
	'SENTRY_DSN', 'MONGO_URI', 'PORT'];

exports.NOT_FOUND = 404;
exports.INTERNAL_SERVER_ERROR = 500;
exports.CSRF_TOKEN_ERROR = 'EBADCSRFTOKEN';

/**
* Checks for environment sanity right before the app starts.
*/
exports.checkVars = function () {
	var subset = _(process.env).pick(REQUIRED_VARS).keys().value(), // eslint-disable-line no-process-env
		missingVars = _.difference(REQUIRED_VARS, subset).toString();

	if (!_.isEmpty(missingVars)) {
		throw new Error(`${missingVars.toString()} environment variables are missing!`);
	}
};

/**
 * Creates an exportable model pseudo class that can be stubbed with helpers.
 *
 * @param {Function} maker - A function that creates a raw instance of the specified model.
 * @param {Object} model - An instance of a MongoDB collection that can be used for making queries.
 * @param {?Object} [helpers={}] - An optional object containing the helper methods specific to the current model.
 * @returns {Object} A model pseudo class that can be used for various CRUD operations.
 */
exports.makeModel = function (maker, model, helpers) {
	return _.assignIn(maker, model, helpers || {});
};
