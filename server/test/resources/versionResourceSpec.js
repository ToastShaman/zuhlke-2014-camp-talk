var restify = require('restify');
var configuration = require('../test-configuration.json');

describe('The version REST api', function () {

  var client = restify.createJsonClient({
    url: 'http://localhost:' + configuration.http.port,
    version: '*'
  });

  var server;

  before(function (done) {
    require('../../src/server').start(configuration, function (err, api) {
      server = api;
      done();
    });
  });

  after(function () {
    server.close();
  });

  it('/version should return the current version', function (done) {
    client.get('/version', function (err, req, res, data) {
      if (err) return done(err);
      data.should.have.property('version', 'development');
      done();
    });
  });
});
