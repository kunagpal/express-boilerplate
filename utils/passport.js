/**
 * @file Contains re-usable social authentication code.
 */

var path = require('path'),

	_ = require('lodash'),
	passport = require('passport'),
	facebook = require('passport-facebook').Strategy,
	google = require('passport-google-oauth2').Strategy,

	user = require(path.join(__dirname, '..', 'database', 'user')),

	AUTH_STRATEGIES = {
		GOOGLE: google,
		FACEBOOK: facebook
	},

	/**
	 * Handles all the heavy lifting related to social authentication.
	 *
	 * @param {Object} req - The request object.
	 * @param {?String} token - The dynamic auth token.
	 * @param {?String} refresh - The static refresh token.
	 * @param {Object} profile - The set of user profile details.
	 * @param {Function} done - The callback that marks the end of the passport process routing.
	 */
	passportCallback = function (req, token, refresh, profile, done) {
		process.nextTick(function () {
			// eslint-disable-next-line lodash/prefer-lodash-method
			return user.find({ _id: req.signedCookies.user }, function (err, doc) {
				var record;

				if (err) { return done(err); }
				if (doc && doc.authStrategy === profile.provider && profile.id === doc.profile) {
					return done(null, doc); // user found, return that user
				}

				record = _.omit(user(), 'passwordHash');

				record.token = token;
				record.dob = new Date();
				record.profile = profile.id;
				record.name = profile.displayName;
				record._id = _.head(profile.emails).value; // eslint-disable-line no-underscore-dangle
				record.authStrategy = profile.provider;

				return user.insert(record, done);
			});
		});
	};

_.forOwn(AUTH_STRATEGIES, function (strategy, name) {
	passport.use(new strategy[name]({
		enableProof: true, // thwarts man in the middle attacks
		passReqToCallback: true, // allows us to pass in the req from our route
		clientID: process.env[`${name}_ID`],
		clientSecret: process.env[`${name}_SECRET`],
		profileFields: ['id', 'email', 'displayName'],
		callbackURL: `<>${_.toLower(name)}/callback`
	}, passportCallback
	));
});
