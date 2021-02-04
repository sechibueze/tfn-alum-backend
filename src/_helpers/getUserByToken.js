const jwt = require('jsonwebtoken');

module.exports = async function (token) {
    const decoded = await jwt.decode(token, process.env.JWT_SECRET_KEY)
    
    return {
        id: decoded.id,
        username: decoded.username
    }
}