var miscUtils = require(path.join(__dirname, '..', '..', '..', 'utils', 'misc'));

describe('Miscellaneous helpers', function () {
	describe('checkVars', function () {
		it('should throw an error for missing environment variables', function () {
			assert.throws(miscUtils.checkVars, Error, 'process.env checks may be invalid!');
		});

		it('should not throw an error for valid environment variables', function () {
			var requiredVars = {
				GOOGLE_ID: true, GOOGLE_KEY: true, FACEBOOK_ID: true, FACEBOOK_KEY: true, COOKIE_SECRET: true,
				SENTRY_DSN: true, MONGO_URI: true, SESSION_SECRET: true, PORT: true
			};

			_.merge(process.env, requiredVars);
			miscUtils.checkVars();
			process.env = _.omit(process.env, _.keys(requiredVars));
		});
	});
});
