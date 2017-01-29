var path = require('path'),
	nsp = require('nsp'),

	packageJson = path.join(__dirname, 'package.json');

module.exports = function (done) {
	nsp.check({ offline: false, package: packageJson }, done);
};

!module.parent && module.exports(process.exit);
