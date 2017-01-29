var pm2 = require('pm2'),
	async = require('async'),

	pack = require('../misc/pack');

module.exports = function (done) {
	async.series([
		pack,

		pm2.connect.bind(pm2),

		function (next) {
			pm2.gracefulReload('bin/www', { updateEnv: true }, next);
		}
	], function (err) {
		pm2.disconnect();
		done(err);
	});
};

!module.parent && module.exports(process.exit);
