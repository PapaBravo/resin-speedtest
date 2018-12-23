const sqlite3 = require('sqlite3');
//const LocalStorage = require('node-localstorage').LocalStorage;
//const localStorage = new LocalStorage(global.config.storage);
const db = new sqlite3.Database(`${global.config.storage}db.sqlite`);

const {create} = require('./queries');

function setup() {
    return new Promise (resolve => db.run(create, resolve));
}

function addMeasurement(data) {
}

module.exports = {
    setup,
    addMeasurement
}