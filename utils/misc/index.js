/**
* @file Contains miscellaneous helpers used throughout the project.
*/

var fs = require('fs'),
	path = require('path'),

	_ = require('lodash'),

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
 * Helper function to load all modules from a directory.
 *
 * @param   {String} dir - The directory from which to load modules.
 * @returns {Object}     A set of all the required modules in dir.
 */
exports.requireDir = function (dir) {
	return _.isString(dir) && !_.isEmpty(dir)
		? _.transform(fs.readdirSync(path.resolve(dir)), function (result, value) { // eslint-disable-line no-sync
			result[path.parse(value).name] = require(path.resolve(dir, value)); // eslint-disable-line global-require
		}, {}) : {};
};
