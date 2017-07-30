/**
* @file Contains miscellaneous helpers used throughout the project.
*/

var _ = require('lodash'),

	REQUIRED_VARS = ['GOOGLE_ID', 'GOOGLE_KEY', 'FACEBOOK_ID', 'FACEBOOK_KEY', 'COOKIE_SECRET', 'SESSION_SECRET',
		'SENTRY_DSN', 'MONGO_URI', 'PORT', 'NODE_ENV'],

	/**
	 * Generates an error handler for the provided type.
	 *
	 * @param {String} type - The type of the error, assigned to the name property of the err instance.
	 * @returns {Function} - A function that returns an error for the specified message and status, under the type.
	 */
	error = function (type) {
		return function (message, status) {
			var stack,
				err = new Error(message);

			err.name = type;
			status && (err.status = status);

			stack = err.stack.split('\n');
			stack.splice(1, 1); // remove the element at index 1

			err.stack = stack.join('\n');

			return err;
		};
	};

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
 * @param {Object} modelName - The name of the model to be created.
 * @param {Object} db - An instance of a MongoDB connection that can be used for making queries.
 * @returns {Object} A model pseudo class that can be used for various CRUD operations.
 */
exports.makeModel = function (modelName, db) {
	if (!(modelName && db)) { return {}; }

	var defaults = {},
		attributes = [],
		model = require(path.resolve(`./database/${modelName}`)), // eslint-disable-line global-require
		config = model && model.config,
		autoEditedAt = config && config.autoEditedAt,
		autoCreatedAt = config && config.autoCreatedAt,
		collection = db.collection(_.toLower(modelName)),
		sanitiseInsert = function (datum) {
			return _(datum).pick(attributes).defaults(defaults).merge(autoCreatedAt && {
				createdAt: new Date().toISOString()
			}).value();
		},
		sanitiseUpdate = function (datum) {
			return _(datum && datum.$set).pick(attributes).merge(autoEditedAt && {
				editedAt: new Date().toISOString()
			}).value();
		};

	Object.freeze(config);
	Object.freeze(config && config.rest);

	_.forEach(model.fields, function (field) {
		var name = field && field.key || field;

		// Consider adding support for mandatory fields as well, although that is kind of anti noSQL
		_.isString(name) && attributes.push(name);

		// eslint-disable-next-line security/detect-object-injection
		field && field.default && (defaults[name] = field.default);
	});

	return !_.isEmpty(model) && _.assignIn(_.pick(model, 'config'), collection, _.defaults(model.helpers, {

		/**
		 * Asynchronously inserts one record for the current model into it's corresponding collection.
		 *
		 * @param {Object} datum - The record to be inserted.
		 * @param {?Function} callback - The function invoked to mark the end of record insertion.
		 * @returns {Promise|*} A promise that can be used to resolve further tasks.
		 */
		insertOne: function (datum, callback) {
			return collection.insertOne(sanitiseInsert(datum), callback);
		},

		/**
		 * Inserts multiple records for the current model into it's corresponding collection.
		 *
		 * @param {Object[]} data - The Array of records to be inserted.
		 * @param {Function} callback - The function invoked to mark the end of the record creation process.
		 * @returns {Promise} - A Promise to handle task chaning.
		 */
		insertMany: function (data, callback) {
			return collection
				.insertMany(_.map(data, sanitiseInsert), callback);
		},

		/**
		 * Updates the first record that matches the provided query.
		 *
		 * @param {Object} filter - The set of attributes to filter by.
		 * @param {Object} datum - The set of changes to be made to the matched record in the current collection.
		 * @param {?Object} datum.$set - Sets to be made to the matched record in the current collection.
		 * @param {?Object} datum.$unset - Unsets to be made to the matched record in the current collection.
		 * @param {?Object} datum.$rename - Renames to be made to the matched record in the current collection.
		 * @param {?Object} options - The options for the current updateOne operation.
		 * @param {?Function} callback - The function invoked to mark the completion of the update process.
		 * @returns {Promise|*} - The promise instance for further task chaining.
		 */
		updateOne: function (filter, datum, options, callback) {
			_.set(datum, '$set', sanitiseUpdate(datum));

			return collection.updateOne(filter, datum, options, callback);
		},

		/**
		 * Updates all records that match the provided query.
		 *
		 * @param {Object} filter - The set of attributes to filter by.
		 * @param {Object} data - The set of changes to be made to the matched records in the current collection.
		 * @param {?Object} data.$set - Sets to be made to the matched records in the current collection.
		 * @param {?Object} data.$unset - Unsets to be made to the matched records in the current collection.
		 * @param {?Object} data.$rename - Renames to be made to the matched records in the current collection.
		 * @param {?Object} options - The options for the current updateMany operation.
		 * @param {?Function} callback - The function invoked to mark the completion of the update process.
		 * @returns {Promise|*} - The promise instance for further task chaining.
		 */
		updateMany: function (filter, data, options, callback) {
			_.set(data, '$set', sanitiseUpdate(data));

			return collection.updateMany.apply(filter, data, options, callback);
		}
	}));
};

exports.error = _.transform(['missingId'], function (result, type) {
	result[type] = error(type); // eslint-disable-line security/detect-object-injection
}, {});
