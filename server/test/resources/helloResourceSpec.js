var restify = require('restify');
var server = require('../../server');

var client = restify.createJsonClient({
  url: 'http://localhost:8081',
  version: '*'
});

var configuration = {
  port: 8081,
  database: {
    url : 'mongodb://localhost:27017/test'
  }
};

describe('helloResource', function() {

  before(function(done) {
    server.start(configuration);
    done();
  });

  it('should return hello world', function(done) {
    client.get('/hello', function(err, req, res, data) {
      if (err) return done(err);
      data.should.have.property('hello', 'world');
      done();
    });
  });
});
