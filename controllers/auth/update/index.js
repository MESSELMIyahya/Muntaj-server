// @ts-check
const { generateAccessToken, generateRefreshToken } = require('../../../utils/auth/jwt/index');
const ApiError = require('../../../utils/apiError');
const errorObject = require('../../../utils/errorObject');
const ms = require('ms');
const UserModel = require('../../../models/userModel');
const storeModel = require('../../../models/storeModel');

// new access token function
const AuthUpdateUserController = async (req, res, next) => {
    try {
        const {email} = req.user
        // get new user's data
        const user = await UserModel.findOne({email})
        if(!user) {
            // if the user doesn't exist
            return next( new ApiError(
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
        
        // if the token isn't valid  it'll throw an error "JWT-EXPIRED"
        // body data
        const JWTBody = {
            email:user.email,
            id:user._id,
            role:user.role,
            username:user.userName,
            pic:user.profileImage || '',
            store: store ? {
                id: store._id,
                image: store.storeImage,
                name: store.name,
            } : null
        }

        // jwt auth 
        const accessToken  = generateAccessToken(JWTBody);
        const refreshToken = generateRefreshToken(JWTBody);

        // cookies ages
        const ac_to_age = ms(process.env.REFRESH_TOKEN_EXPiRES || '60m');
        const re_to_age = ms(process.env.REFRESH_TOKEN_EXPiRES || '60m')

        // saving Access Token and Refresh Token as HTTPOnly cookie
        res.cookie('ac_to',accessToken,{httpOnly:true ,sameSite:'none', secure:true,maxAge:ac_to_age});
        res.cookie('re_to',refreshToken,{httpOnly:true,sameSite:'none', secure:true,maxAge:re_to_age});

        // send tokens 
        return res.json({ id: JWTBody.id, tokens: { acc: accessToken, ref: refreshToken } });
    } catch (err) {
        return next(new ApiError(
            'Update user server error',
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


module.exports = AuthUpdateUserController;
