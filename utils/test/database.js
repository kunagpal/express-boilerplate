var faker = require('faker');

// Generates fake users
exports.user = function (n, done) {
	_.isFunction(n) && (done = n) && (n = 1);

	if (!_.isSafeInteger(n)) { return done(); }

	return User.insertMany(Array.apply(null, Array(n)).map(function () { // eslint-disable-line prefer-spread
		return {
			_id: faker.internet.email(),
			name: faker.name.findName()
		};
	}), done);
};
