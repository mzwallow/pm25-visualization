const path = require('path');
const express = require('express');

const app = express();
const routes = require('./routes/router');

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './public')))
// app.use(routes);

// ===========================================================
const sql = require('mssql');

const config = {
    server: 'localhost',
    user: 'SA',
    password: 'MSSQL@PASSW0RD',
    database: 'SpatialDB',
    options: {
        // encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

app.get('/data', async (req, res) => {
    await sql.connect(config, (err) => {
        if (err) console.error(err);

        new sql.Request().query(`
            SELECT country, AVG(pm25) as AVG_pm25
            FROM SpatialDB.dbo.AirPollution
            GROUP BY country
            ORDER BY AVG_pm25 DESC;
        `, (err, result) => {
            res.json(result.recordset);
        });
    });
});

// ===========================================================

app.listen(3000, () => {
    console.log('Server start at port 3000');
});