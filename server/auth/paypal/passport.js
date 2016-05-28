import passport from 'passport';
import {Strategy as PayPalStrategy} from 'passport-paypal-oauth';

export function setup(User, config) {
  passport.use(new PayPalStrategy({
    clientID: config.paypal.clientId,
    clientSecret: config.paypal.clientSecret,
    callbackURL: config.paypal.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("accessToken: ", accessToken);
      User.findOrCreate({ 'paypal.id': profile.id }, function (err, user) {
        console.log("found user: ", user);
        return done(err, user);
      });
  }));
}
