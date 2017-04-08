/**
 * @file Provides an abstraction (data definition and helpers) over the User collection.
 */

var model = db.collection(path.basename(__filename).split('.')[0].toLowerCase());

module.exports = utils.makeModel(function (data) {
	return _(data)
		.pick(['_id', 'name', 'passwordHash', 'authStrategy', 'settings', 'profile', 'token', 'refreshToken'])
		.defaults({ settings: {}, authStrategy: 'local', createdAt: new Date().toISOString() })
		.value();
}, model);
