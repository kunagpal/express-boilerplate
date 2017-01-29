/**
 * @file Provides an abstraction (data definition and helpers) over the User collection.
 */

var _ = require('lodash'),
	users = db.collection('users'),

	/**
	 * Creates a new instance for the users collection.
	 *
	 * @param {Object} data - A set of user details.
	 * @returns {{email, passwordHash: *, authStrategy: *, editedAt: string, settings: {}}} A users collection compliant
	 * object.
	 */
	user = function (data) {
		return {
			email: data.email,
			passwordHash: data.passwordHash,
			authStrategy: data.authStrategy,
			editedAt: 'N.A',
			settings: {}
		};
	},

	QUERY_LIMIT = 1;

/**
 * Creates a new users record.
 *
 * @param {Object} data - The data object to be inserted into the users collection.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 */
exports.insertOne = function (data, callback) {
	users.insertOne(user(data), callback);
};

/**
 * Provides an interface for bulk record creation.
 *
 * @param {Object[]} records - A list of records to be inserted in bulk.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 */
exports.insertMany = function (records, callback) {
	users.insertMany(_.map(records, user), callback);
};

/**
 * Creates a new users record.
 *
 * @param {Object} data - The data object to be found in the users collection.
 * @param {Function} callback - The function invoked to mark the end of user fetch.
 */
exports.findOne = function (data, callback) {
	users.find(data).limit(QUERY_LIMIT).next(callback); // eslint-disable-line lodash/prefer-lodash-method
};

/**
 * Finds multiple records matching the given constraints.
 *
 * @param {Object} data - The data object to be inserted into the users collection.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 */
exports.find = function (data, callback) {
	users.find(data, callback); // eslint-disable-line lodash/prefer-lodash-method
};

/**
 * Updates the first record to match the provided criteria.
 *
 * @param {Object} query - The data object to query by.
 * @param {Object} data - The data to be updated.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 */
exports.updateOne = function (query, data, callback) {
	users.updateOne(query, data, callback);
};

/**
 * Updates all records that match the provided criteria.
 *
 * @param {?Object} query - The data object to be inserted into the users collection.
 * @param {Object} data - The data object to be inserted into the users collection.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 * @todo Add default values after Node v <6 support has been dropped
 */
exports.update = function (query, data, callback) {
	_.isFunction(data) && (callback = data) && (data = query) && (query = {});

	users.updateMany(query, data, callback);
};

/**
 * Removes the first users record that matches the given criteria.
 *
 * @param {Object} data - The data object to be removed from the users collection.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 */
exports.removeOne = function (data, callback) {
	users.removeOne(data, callback);
};

/**
 * Removes all users record matching the given criteria.
 *
 * @param {Object} data - The data object(s) to be removed from the users collection.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 */
exports.remove = function (data, callback) {
	users.removeMany(data, callback);
};
