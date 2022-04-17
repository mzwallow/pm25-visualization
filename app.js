require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer')
const XLSX = require('xlsx');
const sql = require('mssql');
const Queue = require('bull');
const winston = require('winston');

const app = express();
const routes = require('./routes/router');
const { format } = require('winston');

const upload = multer({ dest: 'files/' });

const PORT = 3000;
const HOST = '0.0.0.0';

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors());

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
//####################################   Step 2   ####################################\\
let progress = 0, dataLength = 0;

// Step: 2)
// Upload file to insert into database
app.post('/air-pollution/upload', upload.single('file'), (req, res) => {
    let i = 0, airPollutionData = [];

    const workbook = XLSX.readFile(req.file.path)
    workbook.SheetNames.forEach((sheetName) => {
        if (i === 0) airPollutionData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        i++;
    });

    sql.connect(config, async (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err.message
            });
        }

        const insertQueue = new Queue(
            'insert air pollution',
            `redis://${process.env['REDIS_HOST']}:${process.env['REDIS_PORT']}`
        )

        insertQueue.empty()

        const promises = airPollutionData.map((row) => {
            insertQueue.add(row);
        });

        await Promise.all(promises);

        progress = 0;
        dataLength = airPollutionData.length;

        const logger = winston.createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.errors({ stack: true }),
                format.splat(),
                format.json()
            ),
            transports: [
                new winston.transports.File({
                    filename: './debug/error.log',
                    options: { flags: 'w' }
                }),
            ]
        });

        insertQueue.process((job) => {
            const request = new sql.Request();
            request.input('country', sql.NVarChar, job.data['country']);
            request.input('city', sql.NVarChar, job.data['city']);
            request.input('year', sql.Int, job.data['Year']);
            request.input('pm25', sql.Float, job.data['pm25']);
            request.input('latitude', sql.Float, job.data['latitude']);
            request.input('longtitude', sql.Float, job.data['longitude'] ? job.data['longitude'] : job.data['longtitude']);
            request.input('population', sql.BigInt, job.data['population']);
            request.input('wbinc16Text', sql.NVarChar, job.data['wbinc16_text']);
            request.input('region', sql.NVarChar, job.data['Region']);
            request.input('concPm25', sql.NVarChar, job.data['conc_pm25']);
            request.input('colorPm25', sql.NVarChar, job.data['color_pm25']);
            request.execute('SpatialDB.dbo.InsertAirPollution', (err) => {
                if (err) {
                    logger.info({
                        message: err.message,
                        data: job.data,
                    });
                }
            });
        });

        insertQueue.on('completed', (job, result) => {
            progress++;

            if (progress === dataLength && dataLength != 0) {
                sql.connect(config, (err) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'can not connect to database',
                            error: err.message
                        });
                    }

                    new sql.Request().query(`
                        UPDATE [SpatialDB].[dbo].[AirPollution]
                        SET Geom = geometry::STGeomFromText('POINT(' + convert(nvarchar(255), longtitude) + ' ' + convert(nvarchar(255), latitude) + ')', 4326);
                    `, (err) => {
                        if (err) {
                            return res.status(500).json({
                                message: 'update Geom failed',
                                error: err.message
                            });
                        }

                        return res.json({ message: 'success' });
                    });
                });
            }
        });
    });
});

// Get running process
app.get('/air-pollution/process', (req, res) => {
    if (progress === dataLength && dataLength !== 0) {
        return res.json({ message: `Success ${progress} of ${dataLength}` });
    } else if (dataLength === 0) {
        return res.json({ message: 'upload air pollution data first' });
    }
    return res.json({ message: `Uploading ${progress} of ${dataLength}` });
});

// Get log file of failed query
app.get('/air-pollution/error.log', (req, res) => {
    if (progress === dataLength && dataLength != 0)
        return res.sendFile(path.join(__dirname, 'debug/error.log'))
    return res.status(500)
        .json({ message: 'process has not finished yet or upload air pollution data first' });
});

// Delete data in AirPolluation Table
app.delete('/air-pollution', (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err.message
            });
        }

        new sql.Request().query(`
            TRUNCATE TABLE SpatialDB.dbo.AirPollution;
        `, (err) => {
            if (err) return res.status(500).json({ error: err.message });

            return res.json({ message: 'success' });
        });
    })
});

//################################   End of Step 2   ################################\\

//####################################   Step 4   ####################################\\
// Step: 4-A)
// List country and city names whose PM 2.5 values are greater than 50 in 2015
app.get('/countries-PM25-gte-50-in-2015.xlsx', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err.message
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

// Step: 4-B)
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

// Step: 4-C)
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

// Step: 4-D)
// Total of the affected population (in number) from given 'year' and 'color_pm25'
app.get('/:year/:color/total-affected-populations.xlsx', async (req, res) => {
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
//################################   End of Step 4   ################################\\

//####################################   Step 5   ####################################\\
// Step: 5-A)
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
            SELECT latitude, longtitude, country, city, Year, Geom
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

// Step: 5-B)
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

            SELECT TOP 50 latitude, longtitude, city, Geom.MakeValid().STDistance(@Pol) AS Distance, Geom
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

// Step: 5-C)
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
            SELECT latitude, longtitude, country, Year, Geom
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

// Step: 5-D)
// List the 4 points of MBR covering all city points in Thailand in 2009
app.get('/4-points-of-mbr-covering-city-points-in-thailand-in-2009', async (req, res) => {
    sql.connect(config, async (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err.message
            });
        }


        const request = new sql.Request()

        request.query(`
            DECLARE @TH geometry
            SELECT @TH=geometry::EnvelopeAggregate(Geom)
            FROM SpatialDB.dbo.AirPollution
            WHERE country='Thailand' AND Year=2016
        
            SELECT @TH.STEnvelope()
        `, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            return res.json(result.recordset);
        });
    });
});

// Step: 5-E)
// List all city points of countries having the highest no. of city points in 2011
app.get('/city-points-of-countries-having-highest-city-points-in-2011', async (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'can not connect to database',
                error: err
            });
        }

        new sql.Request().query(`
            SELECT latitude, longtitude, country, city , Year, Geom
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

// Step: 5-F)
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
            SELECT latitude, longtitude, city, Year, wbinc16_text, Geom
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
//################################   End of Step 5   ################################\\

app.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
