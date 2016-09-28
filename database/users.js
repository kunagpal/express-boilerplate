var user = function (data) {
	return {
		email: data.email,
		passwordHash: data.passwordHash,
		authStrategy: data.authStrategy,
		editedAt: 'N.A',
		settings: {}
	};
};

exports.insert = function (user, callback) {};

exports.fetch = function (user, callback) {};

exports.get = function (user, callback) {};

exports.update = function (user, callback) {};

exports.remove = function (user, callback) {};

exports.welcome = function (user, callback) {};

exports.forgotPassword = function (user, callback) {};

exports.resetPassword = function (user, callback) {};
