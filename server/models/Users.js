var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
  name: String,
  friends: Array,
  online: Boolean
}, {
  timestamps: true
});


var Users = module.exports = mongoose.model('Users', usersSchema);