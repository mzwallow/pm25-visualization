const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'PM2.5 Visualization' });
});

module.exports = router;