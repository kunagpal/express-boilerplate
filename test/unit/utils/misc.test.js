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
			// MONGO_URI is not included here as it it set in bootstrap.test.js
			var requiredVars = {
				GOOGLE_ID: true, GOOGLE_KEY: true, FACEBOOK_ID: true, FACEBOOK_KEY: true, COOKIE_SECRET: true,
				SENTRY_DSN: true, SESSION_SECRET: true, PORT: true
			};

			_.merge(process.env, requiredVars); // eslint-disable-line no-process-env
			miscUtils.checkVars();
			process.env = _.omit(process.env, _.keys(requiredVars)); // eslint-disable-line no-process-env
		});
	});

	describe('makeModel', function () {
		it('should correctly handle invalid parameters', function () {
			assert.strictEqual(miscUtils.makeModel(), false, 'The model maker does not handle invalid input correctly');
		});

		it('should not mutate the provided model', function () {
			var model = { a: 1 };

			miscUtils.makeModel(model);

			assert.deepStrictEqual(model, { a: 1 }, 'The model maker mutates the provided model');
		});

		it('should correctly stub helper methods if none are provided', function () {
			var model = { a: 1 },
				result = miscUtils.makeModel(model);

			assert.deepStrictEqual(_.keys(result), ['a', 'insertOne', 'updateMany'],
				'The model maker does not stub helpers correctly in the absence of overrides');
			assert.strictEqual(result.insertOne.length, 2, 'The model maker insertOne stub might be invalid');
			assert.strictEqual(result.updateMany.length, 3, 'The model maker updateMany stub might be invalid');
		});

		it('should correctly honour provided helper overrides', function () {
			var model = { a: 1 },
				result = miscUtils.makeModel(model, {}, { insertOne: 'insertOne', updateMany: 'updateMany' });

			assert.deepStrictEqual(_.keys(result), ['a', 'insertOne', 'updateMany'],
				'The model maker does not stub helpers correctly in the absence of overrides');
			assert.strictEqual(result.insertOne, 'insertOne', 'The model maker overrides provided insertOne helper');
			assert.strictEqual(result.updateMany, 'updateMany', 'The model maker overrides provided updateMany helper');
		});
	});
});
