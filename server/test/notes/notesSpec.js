var when = require('when');
var MongoClient = require('mongodb').MongoClient;

describe('notes', function() {

  var notes;

  before(function(done) {
    MongoClient.connect('mongodb://localhost:27017/test', function(err, database) {
      if (err) done(err);
      notes = require('../../notes/notes')(database);
      done();
    });
  });

  it('should return the number of notes for a given user', function(done) {
    notes.count().then(function(count) {
      count.should.have.length(0);
      done();
    });
  });
});
