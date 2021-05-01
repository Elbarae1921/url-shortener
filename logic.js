const mysql = require('mysql2/promise');

var connection;

exports.shortenRoute = async function (req, res) {
    const url = req.body.url;

    let resDB = await connection.query("select shorted_url from urls where destination_url = ?", [url]);
    if (resDB[0].length != 0) {
        res.send(JSON.stringify({ "shortUrl": `${process.env.BASE_URL}u/${resDB[0][0].shorted_url}` }));
        return;
    }

    let r;
    do {
        r = Math.random().toString(36).substring(7);

        resDB = await connection.query("select * from urls where shorted_url = ?", [r]);
    } while (resDB[0].length !== 0);

    connection.query("insert into urls (destination_url, shorted_url) values (?, ?)", [url, r]);

    res.send(JSON.stringify({ "shortUrl": `${process.env.BASE_URL}u/${r}` }));
}

exports.linkRedirectRoute = async function (req, res) {
    const url = req.path.substr(3);

    let resDB = await connection.query("select destination_url from urls where shorted_url = ?", [url]);

    if (resDB[0].length == 0) {
        res.sendStatus(404);
    } else {
        res.redirect(resDB[0][0].destination_url);
    }
}

exports.ready = async function () {
    console.log(`URL-shorter listening at http://localhost:${process.env.PORT}`);

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