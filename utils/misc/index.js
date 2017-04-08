/**
* @file Contains miscellaneous helpers used throughout the project.
*/

var _ = require('lodash'),

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
 * Creates an exportable model pseudo class that can be stubbed with helpers.
 *
 * @param {String[]} fields - An array of string attributes to maintain in the current model.
 * @param {Object} model - An instance of a MongoDB collection that can be used for making queries.
 * @param {?Object} [helpers={}] - An optional object containing the helper methods specific to the current model.
 * @returns {Object} A model pseudo class that can be used for various CRUD operations.
 */
exports.makeModel = function (fields, model, helpers) {
	return _.assignIn(function (data) {
		return _(data)
			.pick(fields.concat('_id'))
			.assign({ createdAt: new Date().toISOString() })
			.value();
	}, model, helpers || {});
};
