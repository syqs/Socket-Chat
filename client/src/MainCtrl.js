'use strict';

angular.module('myApp')
	.controller('MainCtrl', ['$scope', 'socket', function($scope, socket) {

		$scope.welcome = 'Chat with friends';
		var room = 'general';

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
			$scope.messages.push(message);
		});

		// User joined
		socket.on('user:join', function(data) {
			$scope.messages.push({
				user: 'General',
				text: data.name + ' is now online.'
			});
			$scope.users.push(data.name);
		});

		// add a message to the conversation when a user disconnects
		socket.on('user:left', function(data) {
			$scope.messages.push({
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

		// Methods published to the scope
		$scope.messages = [];

		// $scope.sendMessage = function() {
		// 	console.log("nessage2 ", $scope.message)
		// 	socket.emit('send:message', {
		// 		message: $scope.message
		// 	});

		// 	// add the message to our model locally
		// 	$scope.messages.push({
		// 		user: $scope.name,
		// 		text: $scope.message
		// 	});

		// 	// clear message box
		// 	$scope.message = '';
		// };
		$scope.test = function (argument) {
			console.log("le test")
		}

		$scope.message2 = {};
		$scope.all = {};

		$scope.sendMessage2 = function(roomName) {
			$scope.all[roomName] = [];
			console.log("nessage2 ", $scope.message2[roomName])
			console.log("nessage23 ", socket)

			socket.emit('send:message', {
				message: $scope.message2[roomName],
				room: roomName
			});

			// add the message to our model locally
			$scope.messages.push({
				user: $scope.name,
				text: $scope.message2[roomName]
			});
			// $scope.all[roomName].push({
			// 	user: $scope.name,
			// 	text: $scope.message2[roomName]
			// });

			// clear message box
			$scope.message2 = {};
		};

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
		var tabs = [{	title: 'General' }];
		var selected = null;
		var previous = null;
		var currentRoom = '';
		$scope.tabs = tabs;
		$scope.data.selectedIndex = 1;

		$scope.joinRoom = function(room) {
			socket.emit('leaveRoom', currentRoom)
			currentRoom = room;
			socket.emit('room', room)
		}

		$scope.addTab = function(title, view) {
			socket.emit('room', title)
			view = view || title + " Content View";
			tabs.push({
				title: title,
				content: view,
				disabled: false
			});
			$scope.data.selectedIndex = tabs.length ;
		};

		$scope.removeTab = function(tab) {
			socket.emit('leaveRoom', tab)
			var index = tabs.indexOf(tab);
			tabs.splice(index, 1);
		};

	}]);