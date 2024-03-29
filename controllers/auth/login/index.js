const UserModel = require('../../../models/userModel');
const storeModel = require('../../../models/storeModel');
const { z } = require('zod');
const { generateAccessToken, generateRefreshToken } = require('../../../utils/auth/jwt/index');
const ApiError = require('../../../utils/apiError');
const errorObject = require('../../../utils/errorObject');
const ms = require('ms')
const bodySchema = z.object({
    email: z.string().email("Email isn't valid"),
    password: z.string().min(8, 'Password must be more then 8 characters'),
})


// login user 

const AuthLoginController = async(req,res,next) => {
    const bodyData  = req.body;

    try {
        await bodySchema.parseAsync(bodyData)
    } catch (err) {
        return next( new ApiError(
            'Invalid body data',
            errorObject(
                undefined,
                err.message,
                undefined,
                "function"
            ),
            400
        ))
    }

    try{
        // if the data is valid 
        const { email,password } = bodyData ;

        // get user 
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

        // verify password 
        const isValidPass = await user.isValidPassword(password);

        if(!isValidPass) {
            // if the password isn't valid
            return next(new ApiError(
                'password is not valid',
                errorObject(
                    undefined,
                    'password is not valid',
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
            email:user.email,
            id:user._id,
            role:user.role,
            username:user.userName,
            pic:user.profileImage || '',
            store: store ? {
                id:store._id,
                image:store.storeImage,
                name:store.name,
            } : null
        }

        // jwt auth 
        const accessToken  = generateAccessToken(JWTBody);
        const refreshToken = generateRefreshToken(JWTBody);

        // cookies ages
        const ac_to_age = ms(process.env.REFRESH_TOKEN_EXPiRES || '60m');
        const re_to_age = ms(process.env.REFRESH_TOKEN_EXPiRES || '60m')

        // saving Access Token and Refresh Token as HTTPOnly cookie
        res.cookie('ac_to',accessToken,{httpOnly:true , sameSite:'none', secure:true,maxAge:ac_to_age});
        res.cookie('re_to',refreshToken,{httpOnly:true, sameSite:'none', secure:true,maxAge:re_to_age});

        // send tokens 
        return res.json({id:user._id,tokens:{acc:accessToken,ref:refreshToken}});
    }catch(err){
        return next(new ApiError(
            'Login new user server error',
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


module.exports = AuthLoginController;
