const express = require("express");
const cors = require('cors');
const routes = require("./api/router.js");
const path = require('path');
const bodyParser = require('body-parser');

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", routes);

app.listen(port, function () {
    console.log("Listening on port", port);
});
