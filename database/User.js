/**
 * @file Provides an abstraction (data definition and helpers) over the User collection.
 */

var _ = require('lodash'),
	users = db.collection('users'),

	/**
	 * Creates a new instance for the users collection.
	 *
	 * @param {Object} data - A set of user details.
	 * @returns {{email, passwordHash: *, authStrategy: *, editedAt: String, settings: {}}} A users collection compliant
	 * object.
	 */
	user = function (data) {
		return {
			_id: data.email,
			name: data.name,
			passwordHash: data.passwordHash,
			authStrategy: data.authStrategy || 'local',
			createdAt: new Date().toISOString(),
			settings: {}
		};
	},

	QUERY_LIMIT = 1;

/**
 * Creates a new users record.
 *
 * @param {Object|Object[]} data - The data object to be inserted into the users collection.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 * @returns {Promise|*} - A handler for the resultant insertOne state.
 */
exports.insert = function (data, callback) {
	var nonArray = !_.isArray(data);

	if (_.isEmpty(data) || (!_.isObject(data) && nonArray)) {
		_.isFunction(data) && (callback = data);

		return utils.handle('Invalid user data', callback);
	}

	return nonArray ? users.insertOne(user(data), callback) : users.insertMany(_.map(data, user), callback);
};

/**
 * Creates a new users record.
 *
 * @param {Object} query - The data object to be found in the users collection.
 * @param {Function} callback - The function invoked to mark the end of user fetch.
 * @returns {Promise|*} - A handler for the resultant findOne state.
 */
exports.findOne = function (query, callback) {
	_.isString(query) && (query = { _id: query });
	_.isFunction(query) && (callback = query) && (query = {});

	return users.find(query).limit(QUERY_LIMIT).next(callback); // eslint-disable-line lodash/prefer-lodash-method
};

/**
 * Finds multiple records matching the given constraints.
 *
 * @param {Object} query - The data object to be inserted into the users collection.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 * @returns {Promise|*} - A handler for the resultant find state.
 */
exports.find = function (query, callback) {
	_.isString(query) && (query = { _id: query });
	_.isFunction(query) && (callback = query) && (query = {});

	return users.find(query).toArray(callback); // eslint-disable-line lodash/prefer-lodash-method
};

/**
 * Updates the first record to match the provided criteria.
 *
 * @param {Object} query - The data object to query by.
 * @param {Object} data - The data to be updated.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 * @returns {Promise|*} - A handler for the resultant updateOne state.
 */
exports.updateOne = function (query, data, callback) {
	_.isString(query) && (query = { _id: query });
	_.isFunction(data) && (callback = data) && (data = query) && (data = {});
	_.isEmpty(data) && (data = query) && (query = {});

	return users.updateOne(query, { $set: data }, callback);
};

/**
 * Updates all records that match the provided criteria.
 *
 * @param {?Object} query - The data object to be inserted into the users collection.
 * @param {Object} data - The data object to be inserted into the users collection.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 * @returns {Promise|*} - A handler for the resultant update state.
 *
 * @todo Add default values after Node v <6 support has been dropped
 */
exports.update = function (query, data, callback) {
	_.isString(query) && (query = { _id: query });
	_.isFunction(data) && (callback = data) && (data = query) && (query = {});

	return users.updateMany(query, data, callback);
};

/**
 * Removes the first users record that matches the given criteria.
 *
 * @param {Object} query - The data object to be removed from the users collection.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 * @returns {Promise|*} - A handler for the resultant removeOne state.
 */
exports.deleteOne = function (query, callback) {
	_.isString(query) && (query = { _id: query });
	_.isFunction(query) && (callback = query) && (query = {});

	return users.deleteOne(query, callback);
};

/**
 * Removes all users record matching the given criteria.
 *
 * @param {Object} query - The data object(s) to be removed from the users collection.
 * @param {Function} callback - The function invoked to mark the end of user creation.
 * @returns {Promise|*} - A handler for the resultant update state.
 */
exports.delete = function (query, callback) {
	_.isString(query) && (query = { _id: query });
	_.isFunction(query) && (callback = query) && (query = {});

	return users.deleteMany(query, callback);
};
