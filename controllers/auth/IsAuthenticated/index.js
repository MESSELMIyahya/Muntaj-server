const { verifyAccessToken,verifyRefreshToken } = require('../../../utils/auth/jwt/index');



// is  Authenticated  

const AuthIsAuthenticatedController = async(req,res) => {
    // verify if cookies exist 
    const cos = req.cookies ;

    if(!cos?.ac_to||!cos?.re_to) return res.status(401).json({authenticated:false});
    try{
        // verify access token and refresh token
        await verifyRefreshToken(cos?.re_to) ;
        const payload = await verifyAccessToken(cos?.ac_to);

        return res.status(200).json({authenticated:true,user:payload})
    }catch(err){
        return res.status(401).json({authenticated:false})
    }
}

module.exports = AuthIsAuthenticatedController ;