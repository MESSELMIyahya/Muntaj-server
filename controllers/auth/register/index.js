const UserModel = require('../../../models/userModel');
const { z } = require('zod');
const ApiError = require('../../../utils/apiError');
const errorObject = require('../../../utils/errorObject');

const bodySchema = z.object({
    lastName: z.string().min(3, 'lastName must be more then 2 characters'),
    firstName: z.string().min(3, 'firstName must be more then 2 characters'),
    email: z.string().email("Email isn't valid"),
    password: z.string().min(8, 'Password must be more then 8 characters'),
    userName: z.string().min(5, 'userName must be more then 4 characters')
})


// register new user function
const AuthRegisterController = async (req, res, next) => {

    const bodyData = req.body;

    try {
        await bodySchema.parseAsync(bodyData)
    } catch (err) {
        return next(new ApiError(
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

    try {

        // if the data is valid 
        const { userName, email, firstName,lastName, password } = bodyData

        // see if this email is existed
        const existedEmail = await UserModel.doesEmailExists(email);

        if (existedEmail) {
            // if the email is taken
            return next(new ApiError(
                `User with email ${email} already exists`,
                errorObject(
                    undefined,
                     `User with email ${email} already exists`,
                    undefined,
                    "function"
                ),
                409
            ))
        }

        const userData = {
            lastName,
            firstName,
            userName,
            slug: 'user',
            email,
            role: 'user',
            auth: {
                oauth: false,
                provider: 'email',
                password
            },
            store: undefined
        }

        // create user 
        const User = new UserModel(userData);
        // saving the user 
        const saved = await User.save();

        // return 
        return res.status(201).json({ message: 'user was created successfully', data: { email, id: saved._id } });
    } catch (err) {
        console.log(err);
        return next(new ApiError(
            'Register new user server error',
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



module.exports = AuthRegisterController; 