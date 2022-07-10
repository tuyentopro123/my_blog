const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, async(accessToken,refreshToken,profile, done) => {  
    try {
      console.log(profile)
      const user = await User.findOne({socialId: profile.id})
      console.log(`the user: ${user}`)
      if(user) {
        console.log(`the current user: ${user}`)
        return done(null,user);
      } else {
        const newUser = new User({
          username: profile.displayName,
          image: profile.photos[0].value,
          socialId: profile.id,
          email:profile.emails[0].value,
        });
        console.log(`the new user: ${newUser}`)
        await newUser.save();
        return done(null,newUser);
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

  