var bunyan = require('bunyan');
var fs = require('fs');
var Server = require('mongodb').Server;

module.exports = function () {

  var logDirectory = '../logs';

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  var log = new bunyan.createLogger({
    name: 'nodejs_production_example',
    streams: [
      { level: 'info' , stream: process.stdout},
      { level: 'info', path: logDirectory + '/server.log'},
      { level: 'error', path: logDirectory + '/error.log'}
    ],
    serializers: bunyan.stdSerializers
  });

  var mongoServer = new Server('localhost', 27017);

  return {
    cluster: false,
    port: 8080,
    database: mongoServer,
    logger: log
  }
}
