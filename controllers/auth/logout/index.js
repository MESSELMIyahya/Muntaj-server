

// logout user 
const AuthLogoutController =  async(req,res,next) => {
    // verify if cookies exist 
    const cos = req.cookies ;
    if(!cos?.ac_to||!cos?.re_to) {
        // if the cookies don't exist
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
    // deleting cookies 
    res.clearCookie('ac_to',{httpOnly:true,sameSite:'none', secure:true,});
    res.clearCookie('re_to',{httpOnly:true,sameSite:'none', secure:true,});
    return res.json({Unauthenticated:true});
}

module.exports =  AuthLogoutController;
