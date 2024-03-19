import jwt from 'jsonwebtoken'


const expiresIn = process.env.REFRESH_TOKEN_EXPiRES || '30m'

const generateRefreshToken = (user)=>  {
    return jwt.sign(user,process.env.REFRESH_TOKEN,{expiresIn});
}

module.exports =  generateRefreshToken;