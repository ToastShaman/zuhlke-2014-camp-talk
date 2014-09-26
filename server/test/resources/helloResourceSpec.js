var restify = require( 'restify' );
var server = require( '../../src/server' );
var configuration = require( '../test-configuration.json' );

var client = restify.createJsonClient( {
  url: 'http://localhost:' + configuration.port,
  version: '*'
} );

describe( 'The hello rest api', function () {

  before( function ( done ) {
    server.start( configuration );
    done();
  } );

  it( '/hello should return hello world', function ( done ) {
    client.get( '/hello', function ( err, req, res, data ) {
      if ( err ) return done( err );
      data.should.have.property( 'hello', 'world' );
      done();
    } );
  } );
} );
