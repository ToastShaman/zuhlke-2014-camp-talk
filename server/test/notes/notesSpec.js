var when = require('when');
var MongoClient = require('mongodb').MongoClient;
var configuration = require('../test-configuration.json');

describe('notes', function() {

  var notes;
  var db;
  
  before(function(done) {
    MongoClient.connect(configuration.database.url, function(err, database) {
      if (err) done(err);
      notes = require('../../src/notes/notes')(database);
      db = database;
      done();
    });
  });

  beforeEach(function(done) {
    db.collection('notes').remove({}, function(err, collection) {
      if (err) done(err);
      done();
    });
  });

  it('should return the number of notes for a given user', function(done) {
    notes.count().then(function(count) {
      count.should.eql(0);
      done();
    });
  });

  it('should save a new note with a generated UUID', function(done) {
    notes.insert({title: 'Hello World'}).then(function(documents) {
      documents[0].should.have.property('title', 'Hello World');
      documents[0].should.have.property('id');
      done();
    });
  });

  it('should save a new note and return a total count of 1', function(done) {
    notes.insert({title: 'Hello World'}).then(function(documents) {
          documents[0].should.have.property('title', 'Hello World');
          notes.count().then(function(count) {
            count.should.eql(1);
            done();
          });
      });
  });

  it('should update an existing note', function(done) {
    notes.insert({title: 'Hello World'}).then(function(documents) {
      var existingNote = documents[0];
      existingNote.should.have.property('id');
      notes.update(existingNote.id, {title: 'Updated Hello World'}).then(function(count) {
        count.should.eql(1);
        done();
      });
    });
  });

  it('deletes an existing note', function(done) {
    notes.insert({title: 'Hello World'}).then(function(documents) {
      var existingNote = documents[0];
      existingNote.should.have.property('id');
      notes.delete(existingNote.id).then(function(document) {
        existingNote.should.have.property('id');
        notes.count().then(function(count) {
          count.should.eql(0);
          done();
        });
      });
    });
  });
});
