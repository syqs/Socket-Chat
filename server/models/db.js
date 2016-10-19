var mongoose = require( 'mongoose' );
mongoose.Promise = require( 'bluebird' );

if(!process.env.URI){
  var uri = 'mongodb://localhost/myapp';
} else {
  var uri = process.env.URI;
}

mongoose.connect(uri)

// Connection Events
// when successfully connected
mongoose.connection.on('connected', function(){
  console.log('Mongoose db connection established with uri:' + uri + ' !');
})

// if there is a connection error
mongoose.connection.on('error', function(err){
  console.error('Error with mongoose db connection: ' + err + ":-(");
})

// on disconnect
mongoose.connection.on('disconnected', function(){
  console.log('Mongoose db has been disconnected.');
})

// if node process ends, close the connection to mongoose
process.on('SIGINT', function(){
  mongoose.connection.close(function(){
    console.log('Mongoose connection has closed by design.');
    process.exit(0);
  })
})

// SCHEMAS
require('./Users');
