var miscUtils = require(path.resolve('utils', 'misc'));

describe('Miscellaneous helpers', function () {
	describe('pluralise', function () {
		it('should correctly handle non-string input', function () {
			assert.strictEqual(miscUtils.pluralize(), '', 'Falsy input must be handled correctly');
		});

		it('should correctly pluralize regular input', function () {
			assert.strictEqual(miscUtils.pluralize('bar'), 'bars', 'Regular input must be pluralized correctly');
		});

		it('should correctly pluralize special input', function () {
			assert.strictEqual(miscUtils.pluralize('fry'), 'fries', 'Special input must be pluralized correctly');
		});
	});

	describe('checkVars', function () {
		it('should throw an error for missing environment variables', function () {
			assert.throws(miscUtils.checkVars, Error, 'process.env checks may be invalid!');
		});

		it('should not throw an error for valid environment variables', function () {
			var requiredVars = {
				GOOGLE_ID: true, GOOGLE_KEY: true, FACEBOOK_ID: true, FACEBOOK_KEY: true, COOKIE_SECRET: true,
				MONGO_URI: true, SENTRY_DSN: true, SESSION_SECRET: true, PORT: true
			};

			_.merge(process.env, requiredVars); // eslint-disable-line no-process-env
			miscUtils.checkVars();
			process.env = _.omit(process.env, _.keys(requiredVars)); // eslint-disable-line no-process-env
		});
	});

	describe('makeModel', function () {
		it('should correctly handle invalid parameters', function () {
			assert.deepStrictEqual(miscUtils.makeModel(), {}, 'Invalid input is not handled correctly');
		});
	});
});
