var fs = require('fs'),
	path = require('path'),
	assert = require('assert'),

	_ = require('lodash'),
	utils = require(path.join(__dirname, '..', '..', 'utils', 'test')),

	APPVEYOR_PATH = 'appveyor.yml';

describe(APPVEYOR_PATH, function () {
	var appveyorYAML = utils.ymlToJson(APPVEYOR_PATH);

	it('should exist', function (done) {
		fs.stat(APPVEYOR_PATH, done);
	});

	it('should have an init script for git line ending config', function () {
		assert(_.head(appveyorYAML.init) === 'git config --global core.autocrlf input', 'Invalid init script');
	});

	it('should have builds set for Node v5, and v6', function () {
		assert.deepStrictEqual(_.map(appveyorYAML.environment.matrix, 'node'), ['4', '5', '6', '7'],
			'Builds might not be set on Node v4-7 only');
	});

	it('should have mongodb in the list of enabled services', function () {
		assert(_.includes(appveyorYAML.services, 'mongodb'),
			'MongoDB might not be installed while building!');
	});

	it('should have a valid install sequence', function () {
		assert.deepStrictEqual(appveyorYAML.install, [
			{ ps: 'Install-Product node $env:node' },
			'npm cache clean',
			'appveyor-retry npm install'
		],
		'Missing / invalid nodejs install statement');
	});

	it('should have MSBuild switched off', function () {
		assert(appveyorYAML.build === 'off', 'Build option has been left on');
	});

	it('should have a valid test sequence', function () {
		var test = appveyorYAML.test_script;

		assert.deepStrictEqual(test, ['node --version && npm --version', { cmd: 'npm test' }],
			'Missing / invalid test sequence');
	});

	it('should have deploy switched off', function () {
		assert(appveyorYAML.deploy === 'off', 'Deploy option has been left on');
	});
});
