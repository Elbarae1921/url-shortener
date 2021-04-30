const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const app = express();
const port = 4446;
dotenv.config();

var connection;
var found = false;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post("/shorten", (req, res) => {
    const url = req.body.url;

    (async () => {
        let r;

        do {
            r = Math.random().toString(36).substring(7);

            let resDB = await connection.query("select * from urls where shorted_url = ?", [r]);
            found = resDB[0].length == 0;
        } while (!found);

        connection.query("insert into urls (destination_url, shorted_url) values (?, ?)", [url, r]);

        res.send(JSON.stringify({ "shortUrl": `http://0xffset.de/u/${r}` }));
    })();
});

app.get("/u/*", (req, res) => {
    (async () => {
        const url = req.path.substr(3);

        let resDB = await connection.query("select destination_url from urls where shorted_url = ?", [url]);

        if (resDB[0].length == 0) {
            res.sendStatus(404);
        } else {
            res.redirect(resDB[0][0].destination_url);
        }
    })();    
});

app.listen(port, () => {
    console.log(`URL-shorter listening at http://localhost:${port}`);

    (async () => {
        try {
            connection = await mysql.createConnection({
                host: process.env.HOST,
                user: process.env.USER,
                password: process.env.PASS,
                database: process.env.DB
            });
            console.log("Connection to MYSQL server successful");
        } catch (err) {
            console.log(err);
            return;
        }
    })();
});
