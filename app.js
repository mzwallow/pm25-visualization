const path = require('path');
const express = require('express');

const app = express();
const routes = require('./routes/router');

app.set('views', './views');
app.use(express.static(path.join(__dirname, './public')))
app.use(routes);

app.listen(3000, () => {
    console.log('Server start at port 3000');
});