const speedTest = require('speedtest-net');
const { LocalStorage } = require('node-localstorage');

const localStorage = new LocalStorage(global.config.storage);
const storageKey = 'TIMES';

function updateStorage(data) {
    data.timestamp = new Date().toISOString();
    console.log(`${data.timestamp}: Measured ${data.speeds.download} down and ${data.speeds.upload} up`);
    let oldValues = localStorage.getItem(storageKey);
    if (!oldValues) {
        oldValues = [];
    } else {
        oldValues = JSON.parse(oldValues);
    }
    oldValues.push(data);
    localStorage.setItem(storageKey, JSON.stringify(oldValues));
}

function testSpeed() {
    const test = speedTest({
        maxTime: 5000
    });
    test.on('data', updateStorage);
    test.on('error', console.error.bind(console));
}

function getCurrentSpeed() {
    return new Promise((resolve, reject) => {
        const test = speedTest({
            maxTime: 5000
        });
        test.on('data', resolve);
        test.on('error', reject);
    });
}

function getData() {
    return JSON.parse(localStorage.getItem(storageKey));
}

module.exports = {
    getCurrentSpeed,
    testSpeed,
    getData
};
