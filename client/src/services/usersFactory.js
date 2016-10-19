(function() {
	"use strict";


	angular
		.module('myApp')
		.factory('Users', Users)

	function Users($scope, $http) {
		return {
			getFriends: function() {
				return $http.get('localhost:4000/api/friends')
					.then(function(response) {
						console.log("response from getFriends: ", response)
						return response;
					});
			},
			addFriend: function() {
				return $http.get('/api/friends/add')
					.then(function(response) {
						console.log("response from getFriends ", response)
						return response;
					});
			},
			removeFriend: function() {
				return $http.get('/api/friends/remove')
					.then(function(response) {
						console.log("response from getFriends ", response)
						return response;
					});
			}
		}
	}

})();