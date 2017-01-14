var _ = require('lodash'),

	REQUIRED_VARS = ['GOOGLE_ID', 'GOOGLE_KEY', 'FACEBOOK_ID', 'FACEBOOK_KEY', 'COOKIE_SECRET', 'SESSION_SECRET',
		'SENTRY_DSN', 'MONGO_URI'];

exports.checkVars = function () {
	var subset = _(process.env).pick(REQUIRED_VARS).keys().value(),
		missingVars = _.difference(REQUIRED_VARS, subset).toString();

	if (!_.isEmpty(missingVars)) {
		throw new Error(`${missingVars.toString()} environment variables are missing!`);
	}
};
