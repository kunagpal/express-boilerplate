/**
 * @file Provides an abstraction (data definition and helpers) over the User collection.
 */

module.exports = {
	config: {
		rest: {
			enabled: true,
			multiUpdate: false,
			multiDelete: false
		},
		autoEditedAt: true,
		autoCreatedAt: true
	},
	fields: ['_id', 'name', 'passwordHash', { key: 'authStrategy', default: 'local' }, { key: 'settings', default: {} },
		'profile', 'token', 'refreshToken', 'resetToken']
};
