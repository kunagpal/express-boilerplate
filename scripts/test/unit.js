var path = require('path'),
	run = require(path.join(__dirname, '..', '..', 'utils', 'test')).runTests;

module.exports = function (done) {
	run('test/unit', done);
};

!module.parent && module.exports(process.exit);
