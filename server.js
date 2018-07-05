
const config = require(`./config/environment.${process.env.NODE_ENV || 'resin'}.json`);

var express = require('express');
var app = express();
var speedTest = require('speedtest-net');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage(config.storage);
const storageKey = 'TIMES';

const INTERVAL = 2 * 60 * 60 * 1000;


// reply to request with "Hello World!"
app.get('/', function (req, res) {
  res.send(JSON.parse(localStorage.getItem(storageKey)));
});

function updateStorage(data) {
  data.timestamp = new Date().toISOString();
  console.log(`${data.timestamp}: Measured ${data.speeds.download} down and ${data.speeds.upload} up`)
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
  let test = speedTest({ maxTime: 5000 });
  test.on('data', updateStorage);
  test.on('error', console.error.bind(console));
}

//start a server on port 80 and log its start to our console
var server = app.listen(config.port, function () {

  var port = server.address().port;
  console.log('Timing app listening on port ', port);

  testSpeed();
  setInterval(testSpeed, INTERVAL);
});
