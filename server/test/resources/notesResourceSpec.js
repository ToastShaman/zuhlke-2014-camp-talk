var restify = require('restify');
var configuration = require('../test-configuration.json');

describe('The notes REST api', function () {

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

  it('/notes should return stored notes', function (done) {
    client.get('/notes', function (err, req, res, data) {
      if (err) return done(err);
      data.notes.should.be.empty;
      done();
    });
  });

  it('should save a new note', function (done) {
    client.post('/notes', {title: 'Hello World'}, function (err, req, res, data) {
      if (err) return done(err);
      console.log(data);
      data[0].should.have.property('title', 'Hello World');
      data[0].should.have.property('id');
      done();
    });
  });
});
