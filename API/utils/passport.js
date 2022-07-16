const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, async(accessToken,refreshToken,profile, done) => {  
    try {
      const user = await User.findOne({socialId: profile.id})
      console.log(`the user: ${user}`)
      if(user) {
        return done(null,user);
      } else {
        const newUser = new User({
          username: profile.displayName,
          image: profile.photos[0].value,
          socialId: profile.id,
          email:profile.emails[0].value,
        });
        await newUser.save();
        return done(null,newUser);
      }
    } catch(err) {
      console.log(err);
    }
  })
);

passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback'
  }, async(accessToken,refreshToken,profile, done) => {  
    try {
      const user = await User.findOne({socialId: profile.id})
      console.log(`the user: ${user}`)
      if(user) {
        return done(null,user);
      } else {
        const newUser = new User({
          username: profile.displayName,
          image: profile.photos[0].value,
          socialId: profile.id,
          email:profile.emails[0].value,
        });
        await newUser.save();
        return done(null);
      }
    } catch(err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});
  
passport.deserializeUser((user, done) => {
  done(null, user);
});

  