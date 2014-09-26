var assert = require( 'assert' );

module.exports = function ( server, configuration ) {

  assert.equal( typeof (server), 'object', "argument 'server' must be a restify server" );

  server.get( '/version', function ( req, res, next ) {
    res.send( {version: configuration.version} );
    next();
  } );
};
