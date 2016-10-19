'use strict';

angular.module('myApp')
	.controller('MainCtrl', ['$scope', 'socket', function($scope, socket, Users) {

		$scope.welcome = 'Chat with friends';
		var room = 'General';
		$scope.message2 = {};
		$scope.all = {};

		// Socket listeners
		socket.on('init', function(data) {
			$scope.name = data.name;
			$scope.users = data.users;
		});

		// Connected, let's sign-up for to receive messages for this room
		socket.on('connect', function() {
			socket.emit('room', room);
		});

		// Got message
		socket.on('send:message', function(message) {
			console.log("message recieved ", message)
			$scope.all[message.room] = $scope.all[message.room] || [];
			$scope.all[message.room].push(message);
		});

		// User joined
		socket.on('user:join', function(data) {
			$scope.all.General.push({
				user: 'General',
				text: data.name + ' is now online.'
			});
			$scope.users.push(data.name);
		});

		// add a message to the conversation when a user disconnects
		socket.on('user:left', function(data) {
			$scope.all.General.push({
				user: 'General',
				text: data.name + ' has disconnected.'
			});
			var i, user;
			for (i = 0; i < $scope.users.length; i++) {
				user = $scope.users[i];
				if (user === data.name) {
					$scope.users.splice(i, 1);
					break;
				}
			}
		});

		$scope.sendMessage = function(roomName) {
			$scope.all[roomName] = $scope.all[roomName] || [];
			
			socket.emit('send:message', {
				message: $scope.message2[roomName],
				room: roomName
			});

			// add the message to our model locally
			$scope.all[roomName].push({
				user: $scope.name,
				text: $scope.message2[roomName]
			});

			// clear message box
			$scope.message2 = {};
		};

		// data object for tracking state of rooms
		$scope.data = {
			selectedIndex: 0,
			secondLocked: true,
			secondLabel: "Item Two",
			bottom: false
		};
		$scope.next = function() {
			$scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
		};
		$scope.previous = function() {
			$scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
		};

		// Rooms
		var rooms = [{	title: 'General' }];
		var selected = null;
		var previous = null;
		// var currentRoom = '';
		$scope.rooms = rooms;
		$scope.data.selectedIndex = 1;

		$scope.joinRoom = function(room) {
			socket.emit('room', room)
			Users.getFriends().then(function(friends){
				console.log("these are the friends: ", friends)
			}).catch(function(err){
				console.log("error happened on client: ", err)
			});
		}

		// Add a room/tab
		$scope.addTab = function(title, view) {
			socket.emit('room', title)
			view = view || title + " Content View";
			rooms.push({
				title: title,
				content: view,
				disabled: false
			});
			$scope.data.selectedIndex = rooms.length ;
		};

		// remove room/tab
		$scope.removeTab = function(tab) {
			socket.emit('leaveRoom', tab)
			var index = rooms.indexOf(tab);
			rooms.splice(index, 1);
		};

	}]);