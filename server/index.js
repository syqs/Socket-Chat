var express = require('express');
var Path = require('path');
var routes = express.Router();;
var socket = require('./controllers/socket.js');
var http = require('http');
var db = require('./models/db.js');
var Users = require('./models/Users');
var assetFolder = Path.resolve(__dirname, '../client/');

routes.use(express.static(assetFolder));


// Get all friends
routes.get('/api/friends', function(req, res) {

  Users.find({}, function(err, userData) {
    if (err) {
      console.error(err.message);
      res.status(404).send({
        error: err.message
      });
    }
    res.status(200).send(userData);
  });
});

// Add a user to mongo
routes.post('/register', function(req, res) {

  // hardcoded for now
  var user = new Users({
    name: 'Turbo',
    friends: [],
    online: true
  });

  user.save(function(err, data) {
    if (err) console.log(err);
    else console.log('Saved : ', data);
  });
  res.status(201).send("success")
});

// add a friend
routes.post('/api/friends/add', function(req, res) {

  var name = req.body.name;
  var friend = req.body.friend;

  Users.findOneAndUpdate({
    'name': name
  }, {
    $push: {
      'friends': friend
    }
  }, function(err, userData) {
    if (err) {
      console.error(err.message);
      res.status(404).send({
        error: err.message
      });
    }
    res.status(201).send(userData);
  });
});

// Remove le friend
routes.post('/api/friends/remove', function(req, res) {

  var name = req.body.name;
  var friend = req.body.friend;
});



// We're in development or production mode;
if (process.env.NODE_ENV !== 'test') {

  // create and run a real server.
  var app = module.exports = express();
  var server = http.createServer(app)

  var io = require('socket.io').listen(server);
  io.sockets.on('connection', socket);

  // Parse incoming request bodies as JSON
  app.use(require('body-parser').json());

  // Mount our main router
  app.use('/', routes);

  // The Catch-all Route
  // This is for supporting browser history pushstate.
  routes.get('/*', function(req, res) {
    res.sendFile(assetFolder + '/index.html')
  })

  // Start the server!
  var port = process.env.PORT || 4000;
  server.listen(port);
  console.log("Listening on port", port);
} else {
  // We're in test mode; make this file importable instead.
  module.exports = routes;
}