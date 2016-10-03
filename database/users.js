var users = db.collection('users'),

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

exports.insert = function (data, callback) {
	users.insertOne(user(data), callback);
};

exports.fetch = function (data, callback) {
	users.find(data, callback); // eslint-disable-line lodash/prefer-lodash-method
};

exports.get = function (data, callback) {
	users.find(data).limit(QUERY_LIMIT).next(callback); // eslint-disable-line lodash/prefer-lodash-method
};

exports.update = function (data, callback) {
	users.updateOne(data, {}, callback);
};

exports.remove = function (data, callback) {
	users.removeOne(data, callback);
};

exports.forgotPassword = function (data, token, callback) {
	users.updateOne(data, { $set: { resetToken: token, editedAt: new Date().toISOString() } }, callback);
};

exports.resetPassword = function (data, hash, callback) {
	users.updaetOne(data, {
		$set: { editedAt: new Date().toISOString(), passwordHash: hash },
		$unset: { resetToken: '', expiry: '' }
	}, callback);
};
