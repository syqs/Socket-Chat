(function() {
  "use strict";

  angular
    .module('myApp')
    .factory('Users', function($rootScope, $http) {

		return {
			getFriends: function() {
				return $http.get('http://localhost:4000/api/friends')
					.then(function(response) {
						return response;
					});
			},
			addFriend: function() {
				return $http.get('http://localhost:4000/api/friends/add')
					.then(function(response) {
						return response;
					});
			},
			removeFriend: function() {
				return $http.get('http://localhost:4000/api/friends/remove')
					.then(function(response) {
						return response;
					});
			}
		}
	})

}());