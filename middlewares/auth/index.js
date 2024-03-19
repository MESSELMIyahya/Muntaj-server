const { verifyAccessToken } = require('../../utils/auth/jwt/index')
const ApiError = require('../../utils/apiError');
const errorObject = require('../../utils/errorObject');

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
        const payload = await verifyAccessToken(cos?.ac_to);
        // if the token isn't valid  it'll throw an error "JWT-EXPIRED"

        // ser the user in req 
        req.user = payload;
        return next();
    } catch (err) {
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

module.exports =  AuthVerifierMiddleware;