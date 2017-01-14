var path = require('path'),

	rootPath = path.join(__dirname, '..', '..'),

	unitTestScript = path.join(rootPath, 'scripts', 'test', 'unit.js'),
	istanbul = require(path.join(rootPath, 'node_modules', 'istanbul', 'lib', 'cli'));

module.exports = function (done) {
	istanbul.runToCompletion(['cover', unitTestScript], done);
};

!module.parent && module.exports(process.exit);
