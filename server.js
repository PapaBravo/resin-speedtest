global.config = require(`./config/environment.${process.env.NODE_ENV || 'local'}.json`);

const express = require('express');
const storage = require('./src/storage');

const { getCurrentSpeed, getData } = require('./src/speedtest');


const app = express();

const INTERVAL = 30 * 60 * 1000;

function runSpeedTest() {
    getCurrentSpeed()
        .then(res => storage.addMeasurement(res))
        .catch(err => console.log(err));
}

// start a server on port 80 and log its start to our console
const server = app.listen(global.config.port, () => {
    const { port } = server.address();
    console.log('Timing app listening on port ', port);
    storage.setup()
        .then(() => {
            app.use(express.static('public'));
            app.get('/data', (req, res) => res.send(getData()));
            return storage.migrateData();
            // setInterval(runSpeedTest, INTERVAL);
        });
});
