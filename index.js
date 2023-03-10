const express = require("express");
const cors = require('cors');
const routes = require("./api/router.js");
const path = require('path');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon')

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('baseUrl', 'http://192.168.168.75:3000');

app.use(favicon(path.join(__dirname, 'asset/icon', 'favicon.ico')))
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", routes);

app.listen(port,'192.168.168.75', function () {
    console.log("Listening on port", port);
});
