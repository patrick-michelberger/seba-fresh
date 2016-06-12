import passport from 'passport';
import _ from 'lodash';
import request from 'request';
import {
  Strategy as FacebookStrategy
} from 'passport-facebook';

export function setup(User, config) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
      profileFields: ["id", "birthday", "email", "first_name", "gender", "last_name"]
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
          'facebook.id': profile.id
        }).exec()
        .then(user => {
          if (user) {
            return done(null, user);
          }

          console.log("refreshToken: ", refreshToken);

          var facebook = _.extend(profile._json, {
            accessToken: accessToken,
            refreshToken: refreshToken
          });
          user = new User({
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            role: 'user',
            provider: 'facebook',
            picture: 'https://graph.facebook.com/' + profile.id + '/picture?width=600&height=600',
            facebook: facebook
          });
          user.save()
            .then(user => done(null, user))
            .catch(err => done(err));
        })
        .catch(err => done(err));
    }));
}
