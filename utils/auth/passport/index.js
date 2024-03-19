const passport = require("passport");
const Google = require('passport-google-oauth20');
const UserModel = require("../../../models/userModel");


function PassportGoogleStrategyConfig() {

    // google strategy
    const GoogleStrategy = Google.Strategy;

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/auth/oauth/google/callback`,
        passReqToCallback: true
    }, async (_, __, ___, profile, next) => {

        // here we create the user 
        const userData = {
            lastName: profile._json.family_name,
            firstName: profile._json.given_name,
            username: profile._json.name || `${profile.name.givenName} ${profile.name.familyName}`,
            slug:'user',
            profileImage: profile.photos[0].value,
            email: profile?._json?.email || profile?.emails[0].value,
            role: 'user',
            auth: {
                oauth: true,
                provider: 'google',
                password: undefined
            },
            store: undefined
        }


        try {

            const existedUser = await UserModel.findOne({ email: userData.email });

            // JWT body 
            const JWTPayload = {
                email: userData.email,
                id: profile._json.sub,
                role: 'user',
                pic: userData.profileImage,
                username: userData.username
            }

            // if user existed 
            if (existedUser) {
                // if user existed but it's not oauth 
                if (!existedUser?.auth.oauth) throw new Error(`user with email ${userData.email} already exists`)

                return next(null, JWTPayload);
            }
            // creating new user if he doesn't exist
            const newUser = new UserModel(userData);
            await newUser.save();

            return next(null, JWTPayload);
        } catch (err) {
            console.log(err);
            return next(err, null);
        }
    }));

}

// passport config 
function PassportConfig() {
    // serialize
    passport.serializeUser((user, done) => {
        done(null, user);
    })
    // deserialize
    passport.deserializeUser((user, done) => {
        done(null, user);
    })
}


module.exports = { PassportConfig, PassportGoogleStrategyConfig }
