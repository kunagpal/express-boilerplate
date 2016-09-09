var fs = require('fs'),
	_ = require('lodash'),
	path = require('path'),
	assert = require('assert'),
	yaml = require('js-yaml'),

	appveyorPath = path.join(__dirname, '..', '..', 'appveyor.yml');

describe('appveyor.yml', function () {
	var appveyorYAML;

	before(function () {
		try {
			appveyorYAML = yaml.safeLoad(fs.readFileSync(appveyorPath, 'utf-8'));
		}
		catch (err) {
			throw err;
		}
	});

	it('should exist', function (done) {
		fs.stat(appveyorPath, done);
	});

	it('should have an init script for git line ending config', function () {
		assert(appveyorYAML.init[0] === 'git config --global core.autocrlf input', 'Invalid init script');
	});

	it('should have builds set for Node v4, v5, and v6', function () {
		assert.deepStrictEqual(_.map(appveyorYAML.environment.matrix, (arg) => {
			return arg.nodejs_version;
		}), ['4', '5', '6'], 'Builds not set on Node v4,5,6 only');
	});

	it('should have a valid install sequence', function () {
		assert(appveyorYAML.install[0].ps === 'Install-Product node $env:nodejs_version',
			'Missing / invalid nodejs install statement');
		assert(appveyorYAML.install[1] === 'npm install', 'Missing / invalid nodejs install statement');
	});

	it('should have MSBuild switched off', function () {
		assert(appveyorYAML.build === 'off', 'Build option has been left on');
	});

	it('should have a valid test sequence', function () {
		var test = appveyorYAML.test_script;

		assert(test[0] === 'node --version && npm --version', 'Missing / invalid version statement');
		assert(test[1].cmd === 'npm test', 'Missing / invalid test suite statement');
	});

	it('should have deploy switched off', function () {
		assert(appveyorYAML.deploy === 'off', 'Deploy option has been left on');
	});
});
