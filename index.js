const express = require('express');
const app     = express();

const PORT = 3000;

const { CRON_LOG_TIME } = require('./utils/cronLog');

app.get('/', function (req, res) {
    let time = '00 0-59 17 * * 0-6';
    CRON_LOG_TIME(time);

    res.send('CronJob Running...');
});

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});