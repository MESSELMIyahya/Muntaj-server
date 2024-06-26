const UserModel = require('../../../../models/userModel');
const storeModel = require('../../../../models/storeModel');
const { generateAccessToken, generateRefreshToken } = require('../../../../utils/auth/jwt/index');
const ms = require('ms');

// passport google controller

const OAuthGoogleLoginController = async (req, res, next) => {
    const userData = req.user;
    if (!userData) {
        throw new ApiError(
            'Unauthenticated',
            errorObject(
                undefined,
                'Unauthenticated',
                undefined,
                "function"
            ),
            401
        )
    }
    try {
        // get user 
        const user = await UserModel.findOne({ email: userData.email });
        if (!user) {
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

        // See if the user has a store

        const store = await storeModel.findOne({
            owner: user._id,
        });

        const JWTBody = {
            email: user.email,
            id: user._id,
            role: 'user',
            username: user.userName,
            pic: user.profileImage,
            store: store ? {
                id: store._id,
                image: store.storeImage,
                name: store.name,
            } : null
        }

        // jwt auth 
        const accessToken = generateAccessToken(JWTBody);
        const refreshToken = generateRefreshToken(JWTBody);

        // cookies ages
        const ac_to_age = ms(process.env.REFRESH_TOKEN_EXPiRES || '60m');
        const re_to_age = ms(process.env.REFRESH_TOKEN_EXPiRES || '60m')

        // saving Access Token and Refresh Token as HTTPOnly cookie
        res.cookie('ac_to', accessToken,  { sameSite:'none', secure:true,httpOnly: true, maxAge: ac_to_age });
        res.cookie('re_to', refreshToken, { sameSite:'none', secure:true,httpOnly: true, maxAge: re_to_age });

        // send tokens 
        return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
        return next(new ApiError(
            'OAuth Google Error Controller',
            errorObject(
                undefined,
                err,
                undefined,
                "function"
            ),
            401
        ))
    }

}


module.exports = OAuthGoogleLoginController;
