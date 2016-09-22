var path = require('path'),

	_ = require('lodash'),
	passport = require('passport'),
	facebook = require('passport-facebook').Strategy,
	google = require('passport-google-oauth2').Strategy,

	user = require(path.join(__dirname, '..', 'controllers', 'user')),

	AUTH_STRATEGIES = {
		GOOGLE: google,
		FACEBOOK: facebook
	},

	passportCallback = function (req, token, refresh, profile, done) {
		process.nextTick(function () {
			// eslint-disable-next-line lodash/prefer-lodash-method
			user.find({ _id: req.signedCookies.user }, function (err, doc) {
				var record;

				if (err) {
					return done(err);
				}
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

				user.insert(record, done);
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
		callbackURL: `<>${name.toLowerCase()}/callback`
	}, passportCallback
	));
});
