const jwt = require('jsonwebtoken');


const expiresIn = process.env.ACCESS_TOKEN_EXPiRES || '5m'

const generateAccessToken = (user)=> {
    return jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn});
}


module.exports =  generateAccessToken;