const { Router } = require("express");
const AuthRegisterController = require("../../controllers/auth/register/index");
const AuthLoginController = require("../../controllers/auth/login/index");
const AuthNewAccessTokenController = require("../../controllers/auth/newAccessToken/index");
const OAuthRouter = require("./passport/index");
const AuthLogoutController = require("../../controllers/auth/logout/index");
const AuthIsAuthenticatedController = require("../../controllers/auth/IsAuthenticated/index");

const app = Router();

// is authenticated route
app.get("/is-authenticated", AuthIsAuthenticatedController);

// register route
app.post("/register", AuthRegisterController);

// login route
app.post("/login", AuthLoginController);

// logout route
app.delete("/logout", AuthLogoutController);

// generate new access token
app.post("/new-access-token", AuthNewAccessTokenController);

// failed route
app.get("/failed", (req, res) => res.send("Try to login again later"));

// OAuth
app.use("/oauth", OAuthRouter);

const AuthRouter = app;
module.exports = AuthRouter;
