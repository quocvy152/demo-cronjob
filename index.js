// EXTERNAL
const express = require('express');
const app     = express();
const Agenda = require("agenda");

// INTERNAL
const MONGOOSE = require('mongoose');
const PATH_CONNECT_DB_NANDIO = 'mongodb://localhost:27017/nandio';
const PORT = 3000;
let counter = 0;

const { CRON_LOG_TIME } = require('./utils/cronLog');

app.get('/', function (req, res) {
    res.send('Hello, This is project learn about CronJob & Agenda');
});

app.get('/cronjob', function (req, res) {
    let time = '00 0-59 17 * * 0-6';
    CRON_LOG_TIME(time);

    res.send('CronJob Running...');
});

app.get('/agenda', function (req, res) {
    // connect db nandio
    MONGOOSE.connect(PATH_CONNECT_DB_NANDIO);
    const mongoConnectionString = PATH_CONNECT_DB_NANDIO;

    const CUSTOMER_COLL = MONGOOSE.model('customer', { 
        email: String,
        fullname: String,
        phone: String,
        code: String, 
    });

    // specifies collection name pass options collection: 'agenda_demo'
    const agenda = new Agenda({ db: { address: mongoConnectionString } });

    agenda.define("GET_LIST", async (job) => {
        // console.log({ message: 'Demo Agenda' })
        let listCustomer = await CUSTOMER_COLL.find();
        if(listCustomer.length > 0) {
            console.log(`CUSTOMER_${counter}: ${listCustomer[counter].phone} - ${listCustomer[counter].fullname}`)
            counter += 1;

            // relist customer
            if(counter == listCustomer.length) {
                counter == 0;
            }
        }
    });

    (async function () {
        // IIFE to give access to async/await
        await agenda.start();
      
        await agenda.every("10 seconds", "GET_LIST");
    })();

    res.send('Agenda Running...')
});

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});