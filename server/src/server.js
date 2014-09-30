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

  // Create the Restify server
  var server = restify.createServer({log: log});

  // Once the connections has been established to Mongodb, start setting up our rest API
  MongoClient.connect(configuration.database, function (err, database) {
    if (err) {
      log.error(err);
      throw err;
    }

    var notes = require('./notes/notes')(database, log);

    // Configure restify to parse query parameters and POST requests
    server.use(restify.requestLogger());
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    // Add some standard HTTP headers for security
    server.use(helmet.xframe('deny'));
    server.use(helmet.nosniff());
    server.use(helmet.hidePoweredBy());
    server.use(helmet.xssFilter());
    server.use(helmet.nosniff());

    // Make sure the output is UTF-8
    server.use(function (req, res, next) {
      res.charSet('utf-8');
      req.notes = notes;
      next();
    });

    // Include our resources
    require('./resources/versionResource')(server, configuration);
    require('./resources/notesResource')(server, notes);

    // If something goes wrong, send a 500 Internal Server Error
    server.use(function (err, req, res, next) {
      log.error(err);
      console.error(err.stack);
      res.send(500);
    });

    // Log the handled HTTP request and response
    server.on('after', restify.auditLogger({log: log}));

    // If there was more severe exception kill the process and it'll
    // be restarted by our scripts
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

    // Start listening for incomming requests
    server.listen(configuration.http.port || 8080, function () {
      log.info('%s listening at %s', server.name, server.url);
      typeof callback === 'function' && callback(null, server);
    });
  });
};
