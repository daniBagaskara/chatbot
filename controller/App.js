const path = require('path');
const jwt = require('jsonwebtoken');
const { env } = require('process');
require('dotenv').config();

class App {
    index(req, res) {
        const data = {
            title: 'Login Page',
            message: 'Welcome to our website!'
        };
        res.render(path.join(__dirname, '../views/index.ejs'), data);
    }

    login(req, res) {
        if (req.body.token !== process.env.TOKEN_LOGIN) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const token = jwt.sign({
            email: req.body.username,
            userId: req.body.token,
        }, process.env.jwt_secret_key, { expiresIn: '4m' });

        res.cookie('token', token, { httpOnly: true, maxAge: 5 * 60 * 1000 });
        res.status(200).json({
            status: true,
            message: 'login Success'
        });
    }

    chat(req, res) {
        const data = {
            title: 'Login Page',
            message: 'Welcome to our website!'
        };
        res.render(path.join(__dirname, '../views/chat.ejs'), data);
    }

    destroy(req,res){
        res.clearCookie('token');
        res.send('Cookie berhasil dihapus!');
    }
}
const object = new App();
module.exports = object;