module.exports = function(server) {

  server.get('/hello', function(req, res, next) {
    res.send({hello: 'world'});
    next();
  });
};