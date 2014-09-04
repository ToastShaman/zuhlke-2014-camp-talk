var restify = require('restify');

var bunyan = require('bunyan');

var helmet = require('helmet');

var log = new bunyan.createLogger({
    name: 'nodejs_production_sample',
    level: 'debug',
    stream: process.stdout,
    serializers: bunyan.stdSerializers
});

var server = restify.createServer({log : log});

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
    next();
});

require('./resources/helloResource')(server);

server.on('after', restify.auditLogger({log: log}));

module.exports.start = function(configuration) {
    server.listen(configuration.port);
};
