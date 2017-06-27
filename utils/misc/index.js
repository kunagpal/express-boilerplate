/**
* @file Contains miscellaneous helpers used throughout the project.
*/

var _ = require('lodash'),

	REQUIRED_VARS = ['GOOGLE_ID', 'GOOGLE_KEY', 'FACEBOOK_ID', 'FACEBOOK_KEY', 'COOKIE_SECRET', 'SESSION_SECRET',
		'SENTRY_DSN', 'MONGO_URI', 'PORT', 'NODE_ENV'];

exports.NOT_FOUND = 404;
exports.INTERNAL_SERVER_ERROR = 500;
exports.CSRF_TOKEN_ERROR = 'EBADCSRFTOKEN';

/**
 * Returns the pluralized equivalent of the provided string.
 *
 * @param {String} str - The string to be pluralized.
 * @returns {String} - The pluralized equivalent of the provided string.
 */
exports.pluralize = function (str) {
	if (!_.isString(str)) { return ''; }

	return _.endsWith(str, 'y') ? str.slice(0, -1) + 'ies' : str + 's';
};

/**
* Checks for environment sanity right before the app starts.
*/
exports.checkVars = function () {
	var subset = _(process.env).pick(REQUIRED_VARS).keys().value(), // eslint-disable-line no-process-env
		missingVars = _.difference(REQUIRED_VARS, subset).toString();

	if (!_.isEmpty(missingVars)) {
		throw new Error(`${missingVars.toString()} environment variable(s) missing!`);
	}
};

/**
 * Creates an exportable model pseudo class that can be stubbed with helpers.
 *
 * @param {Object} fileName - The name of the model to be created.
 * @param {Object} db - An instance of a MongoDB connection that can be used for making queries.
 * @param {Object?} [meta={}] - A set of details about the model fields and default values.
 * @param {?Object} [helpers={}] - An optional object containing the helper methods specific to the current model.
 * @returns {Object} A model pseudo class that can be used for various CRUD operations.
 */
exports.makeModel = function (fileName, db, meta, helpers) {
	if (!fileName || !db) { return; }
	!meta && (meta = {});

	var model = db.collection(_.toLower(path.parse(fileName).name));

	return !_.isEmpty(model) && _.assignIn({}, model, _.defaults(helpers, {
		insertOne: function (data, callback) {
			return model
				.insertOne(_(data)
					.pick(meta.fields)
					.defaults(_.defaults(meta.defaults, { createdAt: new Date().toISOString() }))
					.value(), callback);
		},
		updateMany: function (query, data, callback) {
			return model
				.updateMany(query, {
					$set: _.pick(data, meta.fields)
				}, callback);
		}
	}));
};

/**
 * Handles error and SIGINT events.
 *
 * @param {?Error} err - An error object, optionally passed on from the error event.
 */
exports.handle = function (err) {
	global.db && db.close && db.close(function (error) {
		var e = err || error; // prioritize the unhandled error over the db connection close error

		if (e) { throw e; }
		process.exit(0);
	});
};
