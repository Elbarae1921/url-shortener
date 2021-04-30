const mysql = require('mysql2/promise');

var connection;
var found = false;
const p = 4446;

exports.port = p;

exports.shortenRoute = async function(req, res) {
    const url = req.body.url;

    let r;
    found = false;

    do {
        r = Math.random().toString(36).substring(7);

        let resDB = await connection.query("select * from urls where shorted_url = ?", [r]);
        found = resDB[0].length == 0;
    } while (!found);

    connection.query("insert into urls (destination_url, shorted_url) values (?, ?)", [url, r]);

    res.send(JSON.stringify({ "shortUrl": `http://0xffset.de/u/${r}` }));
}

exports.linkRedirectRoute = async function(req, res) {
    const url = req.path.substr(3);

    let resDB = await connection.query("select destination_url from urls where shorted_url = ?", [url]);

    if (resDB[0].length == 0) {
        res.sendStatus(404);
    } else {
        res.redirect(resDB[0][0].destination_url);
    }
}

exports.ready = async function() {
    console.log(`URL-shorter listening at http://localhost:${p}`);

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
        process.exit(5);
    }
}