/**
 * @file Provides an abstraction (data definition and helpers) over the User collection.
 */

var model = db.collection(_.toLower(path.parse(__filename).name));

module.exports = utils.makeModel(model, {
	defaults: { settings: {}, authStrategy: 'local' }, // createdAt comes implicitly
	fields: ['_id', 'name', 'passwordHash', 'authStrategy', 'settings', 'profile', 'token', 'refreshToken',
		'resetToken']
});
