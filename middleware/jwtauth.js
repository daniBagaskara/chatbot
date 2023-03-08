const jwt = require('jsonwebtoken');
require("dotenv").config();
const secretKey = process.env.jwt_secret_key;

function jwtAuth() {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header not found' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}

module.exports = jwtAuth;
