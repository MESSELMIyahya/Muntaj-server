const generateAccessToken = require('./generateAccessToken/index.js');
const generateRefreshToken = require('./generateRefreshToken/index.js');
const verifyAccessToken = require('./verifyAccessToken/index.js');
const verifyRefreshToken = require('./verifyRefreshToken/index.js');



module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}


