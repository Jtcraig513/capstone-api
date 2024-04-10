require("dotenv").config();
const express = require("express");
// Add http headers, small layer of security
const expressSession = require('express-session');
const cors = require("cors");
// Add http headers, small layer of security
const helmet = require('helmet');
// Passport library and Github Strategy
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const knex = require('knex')(require('./knexfile.js'));

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
// Initialize HTTP Headers middleware
app.use(helmet());
// Enable CORS (with additional config options required for cookies)
app.use(cors({
    origin: true,
    credentials: true,
}));

// Include express-session middleware (with additional config options required for Passport session)
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// =========== Passport Config ============

// Initialize Passport middleware
app.use(passport.initialize());

// Passport.session middleware alters the `req` object with the `user` value
// by converting session id from the client cookie into a deserialized user object.
// This middleware also requires `serializeUser` and `deserializeUser` functions written below
// Additional information: https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do
app.use(passport.session());

// Initialize GitHub strategy middleware
// http://www.passportjs.org/packages/passport-github2/
// We can add multiple strategies with `passport.use` syntax
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['https://www.googleapis.com/auth/userinfo.profile'],
        },
        (_accessToken, _refreshToken, profile, done) => {
            // For our implementation, we don't need access or refresh tokens.
            console.log('Google profile:', profile);

            // Extracting necessary information from the profile object
            const userId = profile.id; // Google's unique user ID
            const avatarUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null; // Avatar URL if available
            const username = profile.displayName || 'Google User'; // Display name or fallback

            //First, check if the user already exists in the database
            knex('users')
                .select('id')
                .where({ google_id: userId })
                .then((user) => {
                    if (user.length) {
                        // If the user is found, pass the user object to the serialize function
                        done(null, user[0]);
                    } else {
                        // If the user isn't found, create a new record
                        knex('users')
                            .insert({
                                google_id: userId,
                                avatar_url: avatarUrl,
                                username: username
                            })
                            .then((newUserId) => {
                                // Pass the user object to the serialize function
                                done(null, { id: newUserId[0] });
                            })
                            .catch((err) => {
                                console.log('Error creating a user:', err);
                                done(err, null);
                            });
                    }
                })
                .catch((err) => {
                    console.log('Error fetching a user:', err);
                    done(err, null);
                });
             }
    )
    )


    // `serializeUser` determines which data of the auth user object should be stored in the session
    // The data comes from `done` function of the strategy
    // The result of the method is attached to the session as `req.session.passport.user = 12345`
    passport.serializeUser((user, done) => {
        console.log('serializeUser (user object):', user);

        // Store only the user id in session
        done(null, user.id);
    });

// `deserializeUser` receives a value sent from `serializeUser` `done` function
// We can then retrieve full user information from our database using the userId
passport.deserializeUser((userId, done) => {
    console.log('deserializeUser (user id):', userId);

    // Query user information from the database for currently authenticated user
    knex('users')
        .where({ id: userId })
        .then((user) => {
            // Remember that knex will return an array of records, so we need to get a single record from it
            console.log('req.user:', user[0]);

            // The full user object will be attached to request object as `req.user`
            done(null, user[0]);
        })
        .catch((err) => {
            console.log('Error finding user', err);
        });
});

// Additional information on serializeUser and deserializeUser:
// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

// =========================================

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const movieRoutes = require("./routes/collections");

app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/collection', movieRoutes);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});