var _ = require('lodash'),

	REQUIRED_VARS = ['GOOGLE_ID', 'GOOGLE_KEY', 'FACEBOOK_ID', 'FACEBOOK_KEY', 'COOKIE_SECRET', 'SESSION_SECRET',
		'SENTRY_DSN', 'MONGO_URI'];

exports.checkVars = function () {
	var missingVars = _(process.env).keys().intersection(REQUIRED_VARS).difference(REQUIRED_VARS).value().toString();

	if (!_.isEmpty(missingVars)) {
		throw new Error(`${missingVars.toString()} environment variables are missing!`);
	}
};
