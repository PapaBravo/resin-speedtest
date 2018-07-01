var express = require('express');
var app = express();
var speedTest = require('speedtest-net');

// reply to request with "Hello World!"
app.get('/', function (req, res) {
  res.send('Hello World!');
});

//start a server on port 80 and log its start to our console
var server = app.listen(80, function () {

  var port = server.address().port;
  console.log('Example app listening on port ', port);

  var test = speedTest({ maxTime: 5000 });

  test.on('data', data => {
    console.dir(data);
  });

  test.on('error', err => {
    console.error(err);
  });

});
