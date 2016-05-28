import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';

export function setup(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ["id", "birthday", "email", "first_name", "gender", "last_name"]
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({'facebook.id': profile.id}).exec()
      .then(user => {
        if (user) {
          return done(null, user);
        }
        user = new User({
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          role: 'user',
          provider: 'facebook',
          picture: 'https://graph.facebook.com/' + profile.id + '/picture',
          facebook: profile._json
        });
        user.save()
          .then(user => done(null, user))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
