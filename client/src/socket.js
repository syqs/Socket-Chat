// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  // find the lowest unused "guest" name and claim it
  var getGuestName = function () {
    var name;
    var nextUserId = 1;
    do {
      name = 'Guest' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));
    return name;
  };

  // serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in names) {
      res.push(user);
    }

    return res;
  };

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

// export function for listening to the socket
module.exports = function (socket) {
  var name = userNames.getGuestName();

  // send the new user their name and a list of users
  socket.emit('init', {
    name: name,
    users: userNames.get()
  });
  
  // handle incoming connections from clients
  
  // got room name
  socket.on('room', function(room) {
      socket.join(room);
  });

  // got leaveRoom
  socket.on('leaveRoom', function(room) {
      socket.leave(room);
  });

  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    name: name
  });

  // broadcast a room name to other clients
  socket.on('openchat', function (data) {
    console.log("this is data.room", data.room)
    socket.broadcast.emit('openchat', {
      room: data.room
    });
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    console.log("this is data.room", data.room)
    socket.broadcast.to(data.room).emit('send:message', {
      user: name,
      text: data.message,
      room: data.room
    });
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
  });
};
