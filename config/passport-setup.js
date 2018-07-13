const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');


passport.serializeUser(function (user,done) {
    done(null,user.id);
});

passport.deserializeUser(function (id,done) {
    User.findById(id).then(function (user) {
        done(null,user)
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accesssToken,refreshToken,profile,done) => {
        // check if user already exists in our db
        User.findOne({userid:profile.id}).then(function (currentUser) {
            if (currentUser){
                //already have the user
               done(null,currentUser)

            } else{
                // if not create user in our db
                new User({
                    username:profile.displayName,
                    userid:profile.id
                    // thumbnail:profile._json.image.url
                }).save()
                    .then(function (newUser) {
                        // console.log('new user create:'+ newUser);
                        done(null, newUser);
                    })
            }
        });
    })
);
passport.use(
    new FacebookStrategy({
        // options for google strategy
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: '/auth/facebook/redirect'
    }, (accesssToken,refreshToken,profile,done) => {
        // check if user already exists in our db
        User.findOne({userid:profile.id}).then(function (currentUser) {
            if (currentUser){
                //already have the user
               done(null,currentUser)

            } else{
                // if not create user in our db
                new User({
                    username:profile.displayName,
                    userid:profile.id
                    // thumbnail:profile._json.image.url
                }).save()
                    .then(function (newUser) {
                        console.log('new user create:'+ newUser);
                        done(null, newUser);
                    })
            }
        });
    })
);