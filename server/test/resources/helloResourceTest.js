var should = require('should');
var restify = require('restify');
var server = require('../../server');

var client = restify.createJsonClient({
    url: 'http://localhost:8081',
    version: '*'
});

describe('helloResource', function() {

    beforeEach(function(done){
        server.start({port : 8081});
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
