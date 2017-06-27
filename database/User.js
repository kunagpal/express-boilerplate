/**
 * @file Provides an abstraction (data definition and helpers) over the User collection.
 */

/**
 * Creates a reusable model object from the provided database connection instance.
 *
 * @param {Object} db - The database connection stub passed from the mongo connect callback.
 * @returns {Object} - A representation of the current model with all available MongoDB methods.
 */
module.exports = function (db) {
	return utils.makeModel(__filename, db, {
		defaults: { settings: {}, authStrategy: 'local' }, // createdAt comes implicitly
		fields: ['_id', 'name', 'passwordHash', 'authStrategy', 'settings', 'profile', 'token', 'refreshToken',
			'resetToken']
	});
};
