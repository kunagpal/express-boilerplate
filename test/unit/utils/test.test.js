var testUtils = require(path.join(__dirname, '..', '..', '..', 'utils', 'test'));

describe('Test helpers', function () {
	describe('ymlToJson', function () {
		it('should return an empty JSON object for invalid yml file path', function () {
			assert.deepStrictEqual(testUtils.ymlToJson('README.md'), {}, 'YmlToJson must default to a blank object');
		});

		it('should return a populated JSON object for a valid yml file path', function () {
			assert.notDeepStrictEqual(testUtils.ymlToJson('.travis.yml'), {}, 'YmlToJson might be faulty');
		});
	});
});
