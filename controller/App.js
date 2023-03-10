const path = require('path');
const jwt = require('jsonwebtoken');
const { env } = require('process');
require('dotenv').config();
const {Configuration, OpenAIApi} = require('openai');

class App {
    index(req, res) {
        const baseUrl = req.app.get('baseUrl');
        const data = {
            title: 'Login Page',
            message: 'Welcome to our website!',
            baseUrl: baseUrl
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

        console.log(token);
        res.cookie('token', token, { httpOnly: true, maxAge: 5 * 60 * 1000 });
        res.status(200).json({
            status: true,
            message: 'login Success'
        });
    }

    chat(req, res) {
        const baseUrl = req.app.get('baseUrl');
        const data = {
            title: 'ChatBOT - OpenAI',
            message: 'Welcome to our website!',
            baseUrl: baseUrl
        };
        res.render(path.join(__dirname, '../views/chat.ejs'), data);
    }

    prompt(req, res){
        const prompt = req.body.message;
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const response = openai.createCompletion({
            model: "text-davinci-003",
            prompt:prompt,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
          });

        response.then(upcomingData => {
            console.log(prompt);
            console.log(upcomingData.data);
            res.json(upcomingData.data.choices[0].text);
        })
    }

    destroy(req,res){
        res.clearCookie('token');
        res.send('Cookie berhasil dihapus!');
    }
}
const object = new App();
module.exports = object;