var faker = require('faker');

// Generates fake users
exports.user = function (n, done) {
	_.isFunction(n) && (done = n) && (n = 1);

	if (!_.isSafeInteger(n)) { return done(); }

	return User.insertMany(Array.apply(null, Array(n)).map(function () { // eslint-disable-line prefer-spread
		var first = faker.name.firstName(),
			last = faker.name.lastName();

		return {
			_id: faker.internet.email(first, last),
			name: first + ' ' + last
		};
	}), done);
};
