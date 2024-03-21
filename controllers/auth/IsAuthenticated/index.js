const { verifyAccessToken,verifyRefreshToken } = require('../../../utils/auth/jwt/index');


// is  Authenticated  
const AuthIsAuthenticatedController = async(req,res) => {
    if(req.user){
        return res.status(200).json({authenticated:true,user:req.user})
    }else {
        return res.status(401).json({authenticated:false})
    }
}

module.exports = AuthIsAuthenticatedController ;