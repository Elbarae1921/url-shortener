const bodyParser = require('body-parser');
const express = require('express');
const logic = require("./logic.js")
const dotenv = require('dotenv');
const path = require('path');

const app = express();
dotenv.config();


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post("/shorten", logic.shortenRoute);

app.get("/u/*", logic.linkRedirectRoute);

app.listen(logic.port, logic.ready);
