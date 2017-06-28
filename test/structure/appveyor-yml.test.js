var APPVEYOR_PATH = '.appveyor.yml';

describe(APPVEYOR_PATH, function () {
	var appveyorYAML = testUtils.ymlToJson(APPVEYOR_PATH);

	it('should exist', function (done) {
		fs.stat(APPVEYOR_PATH, done);
	});

	it('should have an init script for git line ending config', function () {
		assert.deepStrictEqual(appveyorYAML.init, ['git config --global core.autocrlf input',
			'git config --global core.eol lf'], 'Invalid init script');
	});

	it('should have the SESSION_SECRET and MONGO_URI environment variable defined', function () {
		assert(appveyorYAML.environment.SESSION_SECRET, 'The SESSION_SECRET environment variable must be defined');
		assert(appveyorYAML.environment.MONGO_URI, 'The MONGO_URI environment variable must be defined');
	});

	it('should have builds set for Node v5, and v6', function () {
		assert.deepStrictEqual(_.map(appveyorYAML.environment.matrix, 'node'), ['4', '6', '8'],
			'Builds might not be set on Node v4, v6, and v8 only');
	});

	it('should have mongodb in the list of enabled services', function () {
		assert(_.includes(appveyorYAML.services, 'mongodb'),
			'MongoDB might not be installed while building!');
	});

	it('should cache node_modules corectly', function () {
		assert(_.includes(appveyorYAML.cache, 'node_modules -> package.json'), 'node_modules might not be cached');
	});

	it('should have a valid install sequence', function () {
		assert.deepStrictEqual(appveyorYAML.install, [
			{ ps: 'Install-Product node $env:node' },
			'appveyor-retry npm install'
		],
		'Missing / invalid nodejs install statement');
	});

	it('should have MSBuild switched off', function () {
		assert.strictEqual(appveyorYAML.build, 'off', 'Build option has been left on');
	});

	it('should have a valid test sequence', function () {
		var test = appveyorYAML.test_script;

		assert.deepStrictEqual(test, ['node --version && npm --version', { cmd: 'npm test' }],
			'Missing / invalid test sequence');
	});

	it('should have deploy switched off', function () {
		assert.strictEqual(appveyorYAML.deploy, 'off', 'Deploy option has been left on');
	});
});
