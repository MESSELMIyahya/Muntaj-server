const jwt = require('jsonwebtoken');
const ApiError = require('../../../../utils/apiError');
const errorObject = require('../../../../utils/errorObject');

const verifyAccessToken = async (token) => {
    return await new Promise((res, reg) => {

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {

            if (err) {
                if (err.name == 'JsonWebTokenError') {

                    return reg(new ApiError(
                        'Unauthenticated',
                        errorObject(
                            undefined,
                            'Unauthenticated',
                            undefined,
                            "function"
                        ),
                        401
                    ))

                } else {

                    return reg(new ApiError(
                        err.message,
                        errorObject(
                            undefined,
                            err.message,
                            undefined,
                            "function"
                        ),
                        401
                    ))
                }
            }
            return res(user);
        })

    })
}


module.exports = verifyAccessToken;