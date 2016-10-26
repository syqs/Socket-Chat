'use strict';

angular.module('myApp', [
    'ui.router',
    'ngMaterial',
    'luegg.directives'
  ])

  .config(function($stateProvider, $urlRouterProvider, $mdThemingProvider) {

    $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('orange')
    .dark();
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        
});
