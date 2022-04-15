const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const config = {
    server: 'localhost',
    type: 'default',
    options: {
        userName: '',
        password: ''
    }
};

const connection = new Connection(config);

connection.on('connect', (err) => {
    if (err) console.error(err);
    else console.log('Connected');
});

connection.off()