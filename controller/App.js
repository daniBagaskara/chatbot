const path = require('path');
const jwt = require('jsonwebtoken');
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
        if (req.body.token !== 'jfqfqo9ijf093fhekfj;alfsk') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const token = jwt.sign({
            email: req.body.username,
            userId: req.body.token,
        }, process.env.jwt_secret_key, { expiresIn: '4m' });

        res.status(200).json({
            status: true,
            message: 'login Success',
            token: token,
        });
    }

    chat(req, res) {
        console.log(req.user);
        const data = {
            title: 'Login Page',
            message: 'Welcome to our website!'
        };
        res.render(path.join(__dirname, '../views/chat.ejs'), data);
    }
}
const object = new App();
module.exports = object;