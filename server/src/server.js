var MongoClient = require('mongodb').MongoClient;
var restify = require('restify');
var bunyan = require('bunyan');
var helmet = require('helmet');
var fs = require('fs');

module.exports.start = function (configuration, callback) {

  // Create the directory for the logs if it does not exist
  if (!fs.existsSync(configuration.logDirectory)) {
    fs.mkdirSync(configuration.logDirectory);
  }

  // Initialise the logger
  var log = new bunyan.createLogger({
    name: 'nodejs_production_example',
    streams: [
      { level: 'info', stream: process.stdout},
      { level: 'info', path: configuration.logDirectory + '/server.log'},
      { level: 'error', path: configuration.logDirectory + '/error.log'}
    ],
    serializers: bunyan.stdSerializers
  });

  var server = restify.createServer({log: log});

  // Once the connections has been established, start setting up our rest API
  MongoClient.connect(configuration.database, function (err, database) {
    if (err) {
      log.error(err);
      throw err;
    }

    var notes = require('./notes/notes')(database, log);

    server.use(restify.requestLogger());
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    //server.use(restify.gzipResponse());
    server.use(helmet.xframe('deny'));
    server.use(helmet.nosniff());
    server.use(helmet.hidePoweredBy());
    server.use(helmet.xssFilter());
    server.use(helmet.nosniff());
    server.use(function (req, res, next) {
      res.charSet('utf-8');
      req.notes = notes;
      next();
    });

    require('./resources/versionResource')(server, configuration);
    require('./resources/notesResource')(server, notes);

    server.use(function (err, req, res, next) {
      log.error(err);
      console.error(err.stack);
      res.send(500);
    });

    server.on('after', restify.auditLogger({log: log}));

    process.on('uncaughtException', function (err) {
      log.error(err);
      process.exit(1);
    });

    process.on('message', function (message) {
      if (message === 'stopProcess') {
        log.info('Received stopProcess signal... Shutting down');
        server.close(function () {
          mongoclient.close();
          process.exit(0);
        });

        setTimeout(function () {
          console.error('Could not close connections in time, forcefully shutting down');
          process.exit(0);
        }, 30 * 1000);
      }
    });

    server.listen(configuration.http.port || 8080, function () {
      log.info('%s listening at %s', server.name, server.url);
      typeof callback === 'function' && callback(null, server);
    });
  });
};
