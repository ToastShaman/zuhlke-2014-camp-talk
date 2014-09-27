var assert = require('assert');

module.exports = function (server, notes) {

  assert.equal(typeof (server), 'object', "argument 'server' must be a restify server");
  assert.equal(typeof (notes), 'object', "argument 'notes' must be a notes object");

  server.get('/notes', function (req, res, next) {
    notes.find({}).done(function (items) {
      res.send({notes: items});
      next();
    });
  });

  server.post('/notes', function (req, res, next) {
    notes.insert(req.body).done(function (documents) {
      res.send(documents);
      next();
    });
  });
};
