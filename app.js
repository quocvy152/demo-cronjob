// EXTERNAL
const express = require('express');
const app     = express();
const Agenda  = require("agenda");
const axios   = require('axios'); 

// INTERNAL
const MONGOOSE = require('mongoose');
const { DATABASE_ENVI } = require('./constants/DATABASE_ENVI');

const PORT                = 3000;
const PATH_CONNECT_DB     = DATABASE_ENVI.db_nandio_local;
let counter               = 0;
const { KEY_WEATHER_API } = require('./constants/KEY_WEATHER_API');

const { CUSTOMER_COLL } = require('./model/customer-coll');
const { CRON_LOG_TIME } = require('./utils/cronLog');

MONGOOSE.connect(PATH_CONNECT_DB);

app.get('/', function (req, res) {
    res.send('Hello, This is project learn about CronJob & Agenda');
});

app.get('/cronjob', function (req, res) {
    let time = '00 0-59 17 * * 0-6';
    CRON_LOG_TIME(time);

    res.send('CronJob Running...');
});

app.get('/agenda', function (req, res) {
    // specifies collection name pass options collection: 'agenda_demo'
    const agenda = new Agenda({ db: { address: PATH_CONNECT_DB } });

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

app.get('/get-info-coordinates', async function (req, res) {
    const CITY_NAME = 'Ha Noi';
    const LIMIT_LOCATION_RES = 1;
    let dataFilter;

    await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${CITY_NAME}&limit=${LIMIT_LOCATION_RES}&appid=${KEY_WEATHER_API}`)
        .then(response => {
            const { data } = response;
            dataFilter = {
                name: data[0].name,
                lat: data[0].lat,
                lon: data[0].lon,
            };
            // res.send(dataFilter);
        })
        .catch(err => {
            console.log(err)
        })

    await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${dataFilter.lat}&lon=${dataFilter.lon}&appid=${KEY_WEATHER_API}`)
        .then(response => {
            const { data } = response;
            res.send(data);
        })
        .catch(err => {
            console.log(err)
        })
});

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});