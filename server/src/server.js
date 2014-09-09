var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var restify = require('restify');
var bunyan = require('bunyan');
var helmet = require('helmet');

module.exports.start = function(configuration) {

  var log = configuration.logger;
  var server = restify.createServer({log : log});
  var mongoclient = new MongoClient(configuration.database);

  mongoclient.open(function(err, mongoclient) {
    if (err) throw err;
  
    var notes = require('./notes/notes')(mongoclient, log);

    server.use(restify.requestLogger());
    server.use(restify.queryParser());
    server.use(restify.gzipResponse());
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
    
    require('./resources/helloResource')(server);

    server.use(function (err, req, res, next){
      log.error(err);
      console.error(err.stack);
      res.send(500);
    });

    server.on('after', restify.auditLogger({log: log}));

    process.on('uncaughtException', function ( err ) {
      log.error(err);
      process.exit(1);
    });

    process.on('message', function(message) {
      if (message === 'stopProcess') {
        log.info('Received stopProcess signal... Shutting down');
        server.close(function() {
          mongoclient.close();
          process.exit(0);
        });

        setTimeout( function () {
          console.error('Could not close connections in time, forcefully shutting down');
          process.exit(0);
        }, 30*1000);
      }
    });

    server.listen(configuration.port || 8080, function() {
      log.info('%s listening at %s', server.name, server.url);
    });
  });
};
