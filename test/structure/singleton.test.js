var fs = require('fs'),
	path = require('path'),
	assert = require('assert'),

	_ = require('lodash'),
	rootPath = path.join(__dirname, '..', '..');

describe('singleton configuration files', function () {
	it('must have a README.md', function (done) {
		fs.stat(path.join(rootPath, 'README.md'), done);
	});

	it('must have a valid Procfile', function (done) {
		fs.stat(path.join(rootPath, 'Procfile'), done);
	});

	it('must have a npm-shrinkwrap.json', function () {
		var shrinkwrap = require(path.join(rootPath, 'npm-shrinkwrap.json'));

		assert(_.isObject(shrinkwrap), 'npm-shrinkwrap.json appears to be invalid');
	});

	it('must have a valid app.js', function (done) {
		fs.stat(path.join(rootPath, 'app.js'), done);
	});

	it('must have a valid .jsdocrc', function (done) {
		fs.stat(path.join(rootPath, '.jsdocrc'), done);
	});

	it('must have a valid gitginore', function (done) {
		fs.stat(path.join(rootPath, '.gitignore'), done);
	});

	it('must have a valid .gitattributes', function (done) {
		fs.stat(path.join(rootPath, '.gitattributes'), done);
	});

	it('must have a valid ESLint config', function (done) {
		fs.stat(path.join(rootPath, '.eslintrc'), done);
	});

	it('must have a valid ESLint exclusion', function (done) {
		fs.stat(path.join(rootPath, '.eslintignore'), done);
	});

	it('must have a valid EditorCOnfig', function (done) {
		fs.stat(path.join(rootPath, '.editorconfig'), done);
	});

	it('must have a valid CSSLint config', function (done) {
		fs.stat(path.join(rootPath, '.csslintrc'), done);
	});

	it('must have a valid views directory', function (done) {
		fs.stat(path.join(rootPath, 'app.js'), done);
	});

	it('must have a valid test directory', function (done) {
		fs.stat(path.join(rootPath, 'test'), done);
	});

	it('must have a valid scripts directory', function (done) {
		fs.stat(path.join(rootPath, 'scripts'), done);
	});

	it('must have a valid routes directory', function (done) {
		fs.stat(path.join(rootPath, 'routes'), done);
	});

	it('must have a valid public directory', function (done) {
		fs.stat(path.join(rootPath, 'app.js'), done);
	});

	it('must have a valid node_modules directory', function (done) {
		fs.stat(path.join(rootPath, 'node_modules'), done);
	});

	it('must have a valid bin directory', function (done) {
		fs.stat(path.join(rootPath, 'bin'), done);
	});

	it('must have a valid .git directory', function (done) {
		fs.stat(path.join(rootPath, '.git'), done);
	});
});
