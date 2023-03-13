const path = require('path');
const jwt = require('jsonwebtoken');
const {Configuration, OpenAIApi} = require('openai');
const mysql = require('mysql2');
require('dotenv').config();

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
        }, process.env.jwt_secret_key, { expiresIn: '5m' });

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
        // konfigurasi koneksi ke MySQL
        var connection = mysql.createConnection({
            host: process.env.db_host,
            user: process.env.db_user,
            password: process.env.db_pwd,
            database: process.env.db_name,
            port:3306
        });

        const prompt = req.body.message;

        if(prompt.length < 4 ){
            connection.query(
                'SELECT response_api FROM response_chatbot WHERE id = 3',
                function(err, results, fields) {
                  console.log(results);
                  return res.json(results[0].response_api);
                }
            );
        }
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const response = openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
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
            const sql = `INSERT INTO response_chatbot (prompt, response_api) VALUES (?, ?)`;
            const values = [prompt,upcomingData.data.choices[0].text];

            connection.query(sql, values,(error, results, fields) => {
                if (error) throw error;
                console.log(`Response for prompt '${prompt}' has been saved to MySQL.`);
            });

            connection.end();
        });
    }

    destroy(req,res){
        res.clearCookie('token');
        res.send('Cookie berhasil dihapus!');
    }
}
const object = new App();
module.exports = object;