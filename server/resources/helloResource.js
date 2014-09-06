var assert = require('assert');

module.exports = function(server) {

  assert.equal(typeof (server), 'object', "argument 'server' must be a restify server");

  server.get('/hello', function(req, res, next) {
    res.send({hello: 'world'});
    next();
  });
};
