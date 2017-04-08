/**
 * @file Contains re-usable social authentication code.
 */

var passport = require('passport'),
	facebook = require('passport-facebook').Strategy,
	google = require('passport-google-oauth2').Strategy,

	AUTH_STRATEGIES = { GOOGLE: google,	FACEBOOK: facebook },

	/**
	 * Handles all the heavy lifting related to social authentication.
	 *
	 * @param {Object} req - The request object.
	 * @param {String} token - The dynamic auth token.
	 * @param {String} refresh - The static refresh token.
	 * @param {Object} profile - The set of user profile details.
	 * @param {Function} done - The callback that marks the end of the passport process routing.
	 */
	passportCallback = function (req, token, refresh, profile, done) {
		process.nextTick(function () {
			// eslint-disable-next-line lodash/prefer-lodash-method
			User.find({ _id: req.signedCookies.user }).limit(1).next(function (err, doc) {
				if (err) { return done(err); }
				if (doc && doc.authStrategy === profile.provider && profile.id === doc.profile) {
					return done(null, doc); // user found, return that user
				}

				User.insertOne(new User({
					_id: profile.emails[0].value,
					name: profile.displayName,
					authStrategy: profile.provider,
					profile: profile.id,
					token: token,
					refreshToken: refresh
				}), done);
			});
		});
	};

_.forEach(AUTH_STRATEGIES, function (Strategy, name) {
	passport.use(new Strategy[name]({
		enableProof: true, // thwarts man in the middle attacks
		passReqToCallback: true, // allows us to pass in the req from our route
		clientID: process.env[`${name}_ID`],
		clientSecret: process.env[`${name}_SECRET`],
		profileFields: ['id', 'email', 'displayName'],
		callbackURL: `<>${_.toLower(name)}/callback`
	}, passportCallback));
});

module.exports = passport;
