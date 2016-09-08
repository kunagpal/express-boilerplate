var fs = require('fs'),
	path = require('path'),
	assert = require('assert'),

	_ = require('lodash'),
	rootPath = path.join(__dirname, '..', '..');

describe('singleton configuration files', function () {
	it('should have a README.md', function (done) {
		fs.stat(path.join(rootPath, 'README.md'), done);
	});

	it('should have a valid Procfile', function (done) {
		fs.stat(path.join(rootPath, 'Procfile'), done);
	});

	it('should have a npm-shrinkwrap.json', function () {
		var shrinkwrap = require(path.join(rootPath, 'npm-shrinkwrap.json'));

		assert(_.isObject(shrinkwrap), 'npm-shrinkwrap.json appears to be invalid');
	});

	it('should have a valid app.js', function (done) {
		fs.stat(path.join(rootPath, 'app.js'), done);
	});

	it('should have a valid .jsdocrc', function (done) {
		fs.stat(path.join(rootPath, '.jsdocrc'), done);
	});

	it('should have a valid gitginore', function (done) {
		fs.stat(path.join(rootPath, '.gitignore'), done);
	});

	it('should have a valid .gitattributes', function (done) {
		fs.stat(path.join(rootPath, '.gitattributes'), done);
	});

	it('should have a valid ESLint config', function (done) {
		fs.stat(path.join(rootPath, '.eslintrc'), done);
	});

	it('should have a valid ESLint exclusion', function (done) {
		fs.stat(path.join(rootPath, '.eslintignore'), done);
	});

	it('should have a valid EditorCOnfig', function (done) {
		fs.stat(path.join(rootPath, '.editorconfig'), done);
	});

	it('should have a valid CSSLint config', function (done) {
		fs.stat(path.join(rootPath, '.csslintrc'), done);
	});

	it('should have a valid views directory', function (done) {
		fs.stat(path.join(rootPath, 'app.js'), done);
	});

	it('should have a valid test directory', function (done) {
		fs.stat(path.join(rootPath, 'test'), done);
	});

	it('should have a valid scripts directory', function (done) {
		fs.stat(path.join(rootPath, 'scripts'), done);
	});

	it('should have a valid routes directory', function (done) {
		fs.stat(path.join(rootPath, 'routes'), done);
	});

	it('should have a valid public directory', function (done) {
		fs.stat(path.join(rootPath, 'app.js'), done);
	});

	it('should have a valid node_modules directory', function (done) {
		fs.stat(path.join(rootPath, 'node_modules'), done);
	});

	it('should have a valid bin directory', function (done) {
		fs.stat(path.join(rootPath, 'bin'), done);
	});

	it('should have a valid .git directory', function (done) {
		fs.stat(path.join(rootPath, '.git'), done);
	});
});
