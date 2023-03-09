const jwt = require('jsonwebtoken');
require("dotenv").config();
const secretKey = process.env.jwt_secret_key;

function jwtAuth() {
    return async (req, res, next) => {
        const token = req.cookies.token;
        console.log(req);
        if (!token) {
          return res.redirect('/');
        }
        try {
          const decoded = jwt.verify(token, secretKey);
          req.user = decoded.user;
          next();
        } catch (err) {
          return res.redirect('/');
        }
    }
}

module.exports = jwtAuth;
