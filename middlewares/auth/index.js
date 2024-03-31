const { verifyAccessToken, verifyRefreshToken, generateAccessToken } = require('../../utils/auth/jwt/index')
const ApiError = require('../../utils/apiError');
const errorObject = require('../../utils/errorObject');
const ms = require('ms')

const AuthVerifierMiddleware = async (req, res, next) => {
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
        let payload = null

        try {
            payload = await verifyAccessToken(cos?.ac_to);
        } catch (err) {
            if (err.error.msg == 'jwt expired') {

                // if the access token is expired we generate new access token from the refresh token
                const refreshPayload = await verifyRefreshToken(cos?.re_to);

                const JWTBody = {
                    email: refreshPayload.email,
                    id: refreshPayload.id,
                    role: refreshPayload.role,
                    username: refreshPayload.username,
                    pic: refreshPayload.pic,
                    store: refreshPayload.store ? refreshPayload.store : null
                }

                const new_access_token = generateAccessToken(JWTBody);

                const ac_to_age = ms(process.env.REFRESH_TOKEN_EXPiRES || '60m');

                // saving Access Token and Refresh Token as HTTPOnly cookie
                res.cookie('ac_to', new_access_token, { httpOnly: true,sameSite:'none', secure:true, maxAge: ac_to_age });

                // setting the user data
                payload = refreshPayload ;

            } else {
                throw new Error('Unauthenticated');
            }
        }

        // set the user in req 
        req.user = payload;
        return next();
    } catch (err) {
        console.log(err)
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
}

module.exports = AuthVerifierMiddleware;