const sqlite3 = require('sqlite3');
const {
    LocalStorage
} = require('node-localstorage');

const localStorage = new LocalStorage(global.config.storage);

const db = new sqlite3.Database(`${global.config.storage}db.sqlite`);

const {
    create
} = require('./queries');


async function run(query, params) {
    return new Promise((resolve, reject) => db.run(query, params, (err) => {
        if (err) {
            return reject(new Error(`Error when running query "${query}" with params ${JSON.stringify(params || {})}. ${err}`));
        }
        return resolve();
    }));
}


async function all(query, params) {
    return new Promise((resolve, reject) => db.all(query, params, (err, res) => {
        if (err) reject(err);
        else resolve(res);
    }));
}

async function setup() {
    return run(create);
}

async function addMeasurement(data) {
    console.log(`Measured ${data.speeds.download} down and ${data.speeds.upload} up`);
    const query = `
    INSERT INTO Speed (download, upload, clientIp, server, ping)
    VALUES ($download, $upload, $clientIp, $server, $ping);
    `;

    return run(query, {
        $download: data.speeds.download,
        $upload: data.speeds.upload,
        $clientIp: data.client.ip,
        $server: data.server.host,
        $ping: data.server.ping,
        $timestamp: new Date().toISOString()
    });
}

async function getData() {
    const query = 'SELECT * FROM Speed;';
    return all(query);
}

async function migrateData() {
    const values = JSON.parse(localStorage.getItem('TIMES') || '[]');
    const query = `
    INSERT INTO Speed (download, upload, clientIp, server, ping, timestamp)
    VALUES ($download, $upload, $clientIp, $server, $ping, $timestamp);
    `;
    db.run('begin transaction');
    values.forEach((v) => {
        db.run(query, {
            $download: v.speeds.download,
            $upload: v.speeds.upload,
            $clientIp: v.client.ip,
            $server: v.server.host,
            $ping: v.server.ping,
            $timestamp: v.timestamp
        });
        console.log(`Migrated data from ${v.timestamp}`);
    });
    db.run('commit');
}

module.exports = {
    setup,
    addMeasurement,
    getData,
    migrateData
};
