const { Router } = require('express')
const passport = require('passport');
const OAuthGoogleLoginController = require('../../../controllers/auth/passport/google/index')
const { PassportConfig, PassportGoogleStrategyConfig } = require('../../../utils/auth/passport/index');


// Passport config 
PassportConfig();
// Passport Google config 
PassportGoogleStrategyConfig();



const app = Router();


// google login route 
app.get('/google/login',passport.authenticate('google',{scope:['email','profile']}));
// google callback route
app.get('/google/callback',passport.authenticate('google',{session:false,failureRedirect:`${process.env.SERVER_URL}/auth/failed`}),OAuthGoogleLoginController);




const OAuthRouter = app;
module.exports =  OAuthRouter ;

