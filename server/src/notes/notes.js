var assert = require( 'assert' );
var when = require( 'when' );
var uuid = require( 'node-uuid' );

module.exports = function ( db ) {

  assert.equal( typeof (db), 'object', "argument 'db' must be a mongodb connection" );

  return {

    find: function ( query ) {
      assert.equal( typeof (note), 'object', "argument 'options' must be a object" );

      return when.promise( function ( resolve, reject, notify ) {
        db.collection( 'notes' ).find( query ).toArray( function ( err, items ) {
          if ( err ) reject( err );
          resolve( items );
        } );
      } );
    },

    insert: function ( note ) {
      assert.equal( typeof (note), 'object', "argument 'note' must be a object" );
      assert.ok( note.title, "a 'note' needs to have a title: " + JSON.stringify( note ) );

      note.id = uuid.v4();

      return when.promise( function ( resolve, reject, notify ) {
        db.collection( 'notes' ).insert( note, function ( err, documents ) {
          if ( err ) reject( err );
          resolve( documents );
        } );
      } );
    },

    update: function ( id, changes ) {
      assert.ok( id );
      assert.equal( typeof (changes), 'object', "argument 'changes' must be a object" );

      return when.promise( function ( resolve, reject, notify ) {
        db.collection( 'notes' ).update( {id: id}, {$set: changes}, function ( err, count ) {
          if ( err ) reject( err );
          resolve( count );
        } );
      } );
    },

    delete: function ( id ) {
      assert.ok( id );

      return when.promise( function ( resolve, reject, notify ) {
        db.collection( 'notes' ).findAndModify(
          {id: id}, // query
          {}, // sort order
          {}, // replacement
          {remove: true}, // options
          function ( err, document ) {
            if ( err ) reject( err );
            resolve( document );
          } );
      } );
    },

    count: function () {
      return when.promise( function ( resolve, reject, notify ) {
        db.collection( 'notes' ).count( function ( err, count ) {
          if ( err ) reject( err );
          resolve( count );
        } );
      } );
    }
  };
}
