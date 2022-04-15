require('dotenv').config();
const path = require('path');
const express = require('express');
const sql = require('mssql');
const XLSX = require('xlsx');

const app = express();
const routes = require('./routes/router');

const PORT = 3000;
const HOST = '0.0.0.0';

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

const config = {
    server: process.env['DB_SERVER'],
    user: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_INIT'],
    options: {
        // encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

// List country and city names whose PM 2.5 values are greater than 50 in 2015
app.get('/countries-PM25-gte-50-in-2015.xlsx', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err
            });
        }

        new sql.Request().query(`
            SELECT country, city, Year, pm25
            FROM SpatialDB.dbo.AirPollution
            WHERE Year = 2015 AND pm25 >= 50
        `, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            const worksheet = XLSX.utils.json_to_sheet(result.recordset);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet, 'PM25>=50');

            XLSX.writeFileXLSX(workbook,
                path.join(__dirname, `files/countries-pm25-gte-50-in-2015.xlsx`));

            res.sendFile(path.join(__dirname, `files/countries-pm25-gte-50-in-2015.xlsx`),
                (err) => {
                    if (err) return res.status(500).json({ message: 'send file failed' });
                });
        });
    })
});

// List average PM 2.5 by country (decreasing order)
app.get('/avg-pm25-by-countries-desc.xlsx', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err
            });
        }

        new sql.Request().query(`
            SELECT country, AVG(pm25) as AVG_pm25
            FROM SpatialDB.dbo.AirPollution
            GROUP BY country
            ORDER BY AVG_pm25 DESC
        `, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            const worksheet = XLSX.utils.json_to_sheet(result.recordset);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet, 'AVG(PM2.5)');

            XLSX.writeFileXLSX(workbook,
                path.join(__dirname, `files/avg-pm25-by-countries-desc.xlsx`));

            res.sendFile(path.join(__dirname, `files/avg-pm25-by-countries-desc.xlsx`),
                (err) => {
                    if (err) return res.status(500).json({ message: 'send file failed' });
                });
        });
    })
});

// List historical PM 2.5 values in given 'country' by year
app.get('/:country/historical-pm25-by-year.xlsx', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err
            });
        }

        new sql.Request().query(`
            SELECT country, city, Year, pm25
            FROM SpatialDB.dbo.AirPollution
            WHERE country = '${req.params['country']}'
            ORDER BY Year ASC
        `, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            const worksheet = XLSX.utils.json_to_sheet(result.recordset);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Historical PM 2.5');

            XLSX.writeFileXLSX(workbook,
                path.join(__dirname, `files/historical-pm25-by-year.xlsx`));

            res.sendFile(path.join(__dirname, `files/historical-pm25-by-year.xlsx`),
                (err) => {
                    if (err) return res.status(500).json({ message: 'send file failed' });
                });
        });
    })
});

// Total of the affected population (in number) from given 'year' and 'color_pm25'
app.get('/:year/:color/total-affected-populations', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err
            });
        }

        new sql.Request().query(`
            SELECT Year, SUM(population) as population, color_pm25
            FROM SpatialDB.dbo.AirPollution
            GROUP BY Year, color_pm25 
            HAVING Year = ${req.params['year']} 
                AND color_pm25 = '${req.params['color']}';
        `, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            const worksheet = XLSX.utils.json_to_sheet(result.recordset);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Affected population');

            XLSX.writeFileXLSX(workbook,
                path.join(__dirname, `files/total-affected-populations.xlsx`));

            res.sendFile(path.join(__dirname, `files/total-affected-populations.xlsx`),
                (err) => {
                    if (err) return res.status(500).json({ message: 'send file failed' });
                });
        });
    })
});

// List all the city points of all countries by given 'year'
app.get('/city-points-of-all-countries/:year', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err
            });
        }

        new sql.Request().query(`
            SELECT country, city, Year, Geom
            FROM SpatialDB.dbo.AirPollution
            WHERE YEAR = ${req.params['year']}
        `, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(result.recordset);            
        });
    })
});

// List the 50 closest city points to Bangkok
app.get('/50-city-points-closest-to-bangkok', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err
            });
        }

        new sql.Request().query(`
            DECLARE @Pol GEOMETRY;

            SELECT @Pol = Geom
            FROM SpatialDB.dbo.AirPollution
            WHERE city = 'Bangkok';

            SELECT TOP 50 city, Geom.MakeValid().STDistance(@Pol) AS Distance, Geom
            FROM SpatialDB.dbo.AirPollution
            ORDER BY Distance ASC;
        `, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(result.recordset);            
        });
    })
});

// List all the city points of Thailand’s neighboring countries in 2018
app.get('/city-points-of-thailand-neighbors-in-2018', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err
            });
        }

        new sql.Request().query(`
            SELECT country, year, Geom
            FROM SpatialDB.dbo.AirPollution
            WHERE country IN ('Cambodia', 'Laos','Myanmar','Malaysia') AND Year = 2018
        `, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(result.recordset);            
        });
    })
});

// List the 4 points of MBR covering all city points in Thailand in 2009
app.get('/4-points-of-mbr-covering-city-points-in-thailand-in-2018', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err
            });
        }

        new sql.Request().query(`
            SELECT TOP 1 latitude,longtitude, geom
            FROM SpatialDB.dbo.AirPollution
            WHERE country = 'Thailand' AND Year = 2014
            ORDER BY latitude ASC;
            
            SELECT TOP 1 latitude,longtitude, geom
            FROM SpatialDB.dbo.AirPollution
            WHERE country = 'Thailand' AND Year = 2014
            ORDER BY latitude DESC;
            
            SELECT TOP 1 longtitude, latitude, geom
            FROM SpatialDB.dbo.AirPollution
            WHERE country = 'Thailand' AND Year = 2014
            ORDER BY longtitude ASC;
            
            SELECT TOP 1 longtitude, latitude, geom
            FROM SpatialDB.dbo.AirPollution
            WHERE country = 'Thailand' AND Year = 2014
            ORDER BY longtitude DESC;
        `, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(result.recordset);            
        });
    })
});

// List all city points of countries having the highest no. of city points in 2011
app.get('/city-points-of-countries-having-highest-city-points-in-2018', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err
            });
        }

        new sql.Request().query(`
            SELECT country, city , Year, geom
            FROM SpatialDB.dbo.AirPollution
            WHERE country = (SELECT TOP 1 country
                FROM SpatialDB.dbo.AirPollution
                GROUP BY country, year HAVING Year = 2011
                ORDER BY COUNT(country) desc)
                AND Year = 2011;
        `, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(result.recordset);            
        });
    })
});

// List all the city points which are considered as “low income” by given 'year'
app.get('/city-points-have-low-income/:year', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err
            });
        }

        new sql.Request().query(`
            SELECT city , Year, wbinc16_text, geom
            FROM SpatialDB.dbo.AirPollution
            WHERE Year = ${req.params['year']} AND wbinc16_text = 'low income';
        `, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(result.recordset);            
        });
    })
});

app.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});