var express = require('express');
var Path = require('path');
var routes = express.Router();
var socket = require('../client/src/socket.js');
var http = require('http');

var assetFolder = Path.resolve(__dirname, '../client/');
routes.use(express.static(assetFolder));

//
// Example endpoint (also tested in test/server/index_test.js)
//
routes.get('/api/tags-example', function(req, res) {
  res.send(['node', 'express', 'angular'])
});

if(process.env.NODE_ENV !== 'test') {

  //
  // We're in development or production mode;
  // create and run a real server.
  //

  var app = module.exports = express();
  var server = http.createServer(app)
  
  var io = require('socket.io').listen(server);
  io.sockets.on('connection', socket);
  // Parse incoming request bodies as JSON
  app.use( require('body-parser').json() );

  // Mount our main router
  app.use('/', routes);

  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  //
  routes.get('/*', function(req, res){
    res.sendFile( assetFolder + '/index.html' )
  })

  // Start the server!
  var port = process.env.PORT || 4000;
  server.listen(port);



  console.log("Listening on port", port);
} else {
  // We're in test mode; make this file importable instead.
  module.exports = routes;
}