var app = angular.module('hk-app', ['ngRoute'])

  .controller('WelcomeCtrl', ['$scope', function($scope) {

    // variables
    $scope.user;

    // scope function
    $scope.start = function() {
      alert("Ok, let's start");
    }

    // isolated functions
    var onLogin = function(response) {
      if (response.status == 'connected') {
        FB.api('/me?fields=id,name', function(data) {
          $scope.user = data;
        });
      }
    }

    var login = function() {
      FB.getLoginStatus(function(response) {
        // Check login status on load, and if the user is
        // already logged in, go directly to the welcome message.
        if (response.status == 'connected') {
          onLogin(response);
        } else {
          // Otherwise, show Login dialog first.
          FB.login(function(response) {
            onLogin(response);
          }, {scope: 'user_friends, email'});
        }
      });
    }

    var init = function() {
      login();
    }

    init();

  }])

  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    var pre = '/template/';

    $routeProvider

      .when('/', {
        templateUrl: pre + 'welcome.html',
        controller: 'WelcomeCtrl',
      })

      .when('/game', {
        templateUrl: pre + 'game.html',
        controller: 'GameCtrl',
      })

      .otherwise({redirectTo: '/'});


    // $locationProvider.html5Mode(true);

  }]);