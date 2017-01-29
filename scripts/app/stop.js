var pm2 = require('pm2'),
	async = require('async');

module.exports = function (done) {
	async.series([
		pm2.connect.bind(pm2),

		function (next) {
			pm2.stop('bin/www', next);
		}
	], function (err) {
		pm2.disconnect();
		done(err);
	});
};

!module.parent && module.exports(process.exit);
