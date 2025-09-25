import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../database/models/index.js';

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
}, async (accessToken, refreshToken, profile, done) => {
  const [user] = await User.findOrCreate({
    where: { provider: 'google', provider_id: profile.id },
    defaults: { email: profile.emails[0].value, name: profile.displayName, membership_id: 1 }
  });
  done(null, user);
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: process.env.FB_CALLBACK,
  profileFields: ['id','displayName','emails']
}, async (accessToken, refreshToken, profile, done) => {
  const [user] = await User.findOrCreate({
    where: { provider: 'facebook', provider_id: profile.id },
    defaults: { email: profile.emails[0].value, name: profile.displayName, membership_id: 1 }
  });
  done(null, user);
}));