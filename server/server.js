var MongoClient = require('mongodb').MongoClient;
var restify = require('restify');
var bunyan = require('bunyan');
var helmet = require('helmet');
var log = new bunyan.createLogger({
  name: 'nodejs_production_sample',
  level: 'debug',
  stream: process.stdout,
  serializers: bunyan.stdSerializers
});

module.exports.start = function(configuration) {
  var server = restify.createServer({log : log});
  
  MongoClient.connect(configuration.database.url, function(err, database) {
    if (err) throw err;
  
    var notes = require('./notes/notes')(database, log);

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
      req.db = database;
      req.notes = notes;
      next();
    });
    
    require('./resources/helloResource')(server);
    
    //server.on('after', restify.auditLogger({log: log}));

    server.listen(configuration.port || 8080);
  });
};
