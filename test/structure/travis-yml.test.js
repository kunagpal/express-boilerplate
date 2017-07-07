var TRAVIS_PATH = '.travis.yml';

describe(TRAVIS_PATH, function () {
	var travisYAML = testUtils.ymlToJson(TRAVIS_PATH);

	it('should exist', function (done) {
		fs.stat(TRAVIS_PATH, done);
	});

	it('should run builds on linux and osx', function () {
		assert.deepStrictEqual(travisYAML.os, ['osx'], 'Travis builds are not set to linux and osx');
	});

	it('should have a language field with value node_js', function () {
		assert.strictEqual(travisYAML.language, 'node_js', 'Travis build language is not set to node_js');
	});

	it('should have builds set for Node v4-6-8', function () {
		assert.deepStrictEqual(travisYAML.node_js, ['4', '6', '8'], 'Travis is not set for builds on Node v4, v6, v8');
	});

	it('should run on master and develop only', function () {
		assert.deepStrictEqual(travisYAML.branches.only, ['master', 'develop'], 'Non master/develop branches included');
	});

	describe('addons', function () {
		var addons = travisYAML.addons;

		it('should have mongodb listed as a package', function () {
			assert.deepStrictEqual(addons.apt.packages, ['mongodb-org-server'], 'Incorrect build package specified');
		});

		it('should have a secured codeclimate repository token', function () {
			assert(/^.+$/.test(addons.code_climate.repo_token.secure), 'Invalid codeclimate repo token');
		});
	});

	it('should bootstrap MacOSX builds correctly', function () {
		// eslint-disable-next-line max-len
		assert.strictEqual(travisYAML.before_install, 'if [[ $TRAVIS_OS_NAME = \'osx\' ]]; then sudo mkdir -p /data/db; brew install mongodb; brew services start mongodb; fi',
			'MongoDB might not work correctly for MacOSX builds');
	});

	it('should use mongodb as a service', function () {
		assert.deepStrictEqual(travisYAML.services, ['mongodb'], 'MongoDB may not be used');
	});

	it('should cache the node_modules', function () {
		assert.deepStrictEqual(travisYAML.cache.directories, ['node_modules'], 'Caching may be invalid');
	});

	it('should correctly publish code coverge to CodeClimate', function () {
		assert.deepStrictEqual(travisYAML.after_script, [
			'npm install codeclimate-test-reporter',
			'node node_modules/.bin/codeclimate-test-reporter < .coverage/lcov.info'
		], 'Invalid post build sequence');
	});
});
