const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../../utils/auth/jwt/index');
const ApiError = require('../../../utils/apiError');
const errorObject = require('../../../utils/errorObject');
const ms = require('ms')

// new access token function
const AuthNewAccessTokenController = async (req, res, next) => {
    // verify if cookies exist 
    const cos = req.cookies;
    if (!cos?.ac_to || !cos?.re_to) {
        return next(new ApiError(
            'Unauthenticated',
            errorObject(
                undefined,
                'Unauthenticated',
                undefined,
                "function"
            ),
            401
        ))
    }
    try {
        // verify access token 
        const payload = await verifyRefreshToken(cos?.re_to);
        // if the token isn't valid  it'll throw an error "JWT-EXPIRED"
        // body data
        const JWTBody = {
            email: payload.email,
            id: payload.id,
            role: payload.role,
            username: payload.username,
            pic: payload.pic
        }
        // jwt auth 
        const accessToken = generateAccessToken(JWTBody);
        const refreshToken = generateRefreshToken(JWTBody);

        // cookies ages
        const ac_to_age = ms(process.env.ACCESS_TOKEN_EXPiRES || '5m');
        const re_to_age = ms(process.env.REFRESH_TOKEN_EXPiRES || '30m')

        // saving Access Token and Refresh Token as HTTPOnly cookie
        res.cookie('ac_to', accessToken, { httpOnly: true, maxAge: ac_to_age });
        res.cookie('re_to', refreshToken, { httpOnly: true, maxAge: re_to_age });

        // send tokens 
        return res.json({ id: payload.id, tokens: { acc: accessToken, ref: refreshToken } });
    } catch (err) {
        return next(new ApiError(
            'New access token server error',
            errorObject(
                undefined,
                err,
                undefined,
                "function"
            ),
            500
        ))
    }

}


module.exports = AuthNewAccessTokenController;
