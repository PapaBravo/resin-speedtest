
global.config = require(`./config/environment.${process.env.NODE_ENV || 'local'}.json`);

const {testSpeed, getData} = require('./src/speedtest');
const storage = require('./src/storage');
const express = require('express');
const app = express();

const INTERVAL = 30 * 60 * 1000;
app.use(express.static('public'));

app.get('/data', function (req, res) {
  res.send(getData());
});

//start a server on port 80 and log its start to our console
var server = app.listen(global.config.port, function () {

  var port = server.address().port;
  console.log('Timing app listening on port ', port);

  storage.setup().then(res => console.log(res))
  //testSpeed();
  //setInterval(testSpeed, INTERVAL);
});
