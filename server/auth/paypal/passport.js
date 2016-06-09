import passport from 'passport';
import {
  Strategy as PayPalStrategy
} from 'passport-paypal-oauth';

export function setup(User, config) {
  passport.use(new PayPalStrategy({
      clientID: config.paypal.clientId,
      clientSecret: config.paypal.clientSecret,
      callbackURL: config.paypal.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
          'paypal.id': profile.id
        }).exec()
        .then(user => {
          if (user) {
            return done(null, user);
          }
          console.log("received profile: ", profile);
          user = new User({
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            role: 'user',
            provider: 'paypal',
            facebook: profile._json
          });
          user.save()
            .then(user => done(null, user))
            .catch(err => done(err));
        })
        .catch(err => done(err));
    }));
}
