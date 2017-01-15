var path = require('path'),

	async = require('async'),

	e2e = require(path.join(__dirname, 'e2e')),
	esLint = require(path.join(__dirname, 'esLint')),
	structure = require(path.join(__dirname, 'structure')),
	unit = require(path.join(__dirname, '..', 'misc', 'test'));

module.exports = function (done) {
	async.series([esLint, structure, unit, e2e], done);
};

!module.parent && module.exports(process.exit);
