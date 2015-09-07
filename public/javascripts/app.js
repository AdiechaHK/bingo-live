var app = angular.module('hk-app', ['ngRoute'])

  .controller('WelcomeCtrl', ['$scope', function($scope) {

    // variables
    $scope.user = {
      name: "-- user name --"
    };

    // scope function
    $scope.start = function() {
      // localStorage.setItem('user', JSON.stringify($scope.user));
      if($scope.user.id != undefined) {
        window.location.hash = "#/game/" + $scope.user.id + "/" + $scope.user.name;
      } else {
        alert("Hey, need to login with facebook first to start the game, if you cancelled facebook login, just reload the page to retry facebook login.");
      }
    }

    // isolated functions
    var onLogin = function(response) {
      if (response.status == 'connected') {
        FB.api('/me?fields=id,name', function(data) {
          $scope.user = data;
          $scope.$apply();
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

  .controller('GameCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {

    $scope.user;
    $scope.opponent;
    $scope.game;
    $scope.rowz;
    $scope.stat;
    $scope.actions;
    $scope.points;
    $scope.winingMsg;
    $scope.alphabet;

    var socket;

    $scope.cellClass = function(c) {
      return ($scope.game != null && $scope.game.actions.indexOf(c) != -1? "checked": "");
    }

    $scope.applyAction = function(c) {
      if($scope.stat && $scope.winingMsg == undefined) {
        if($scope.game.actions.indexOf(c) == -1) {
          $scope.game.actions += c;
          socket.emit('game_action', {
            'player': $scope.user.id,
            'game': $scope.game.id,
            'chr': c
          });
        } else {
          alert("It's already checked!");
        }
      } else {
        $("#notYT").show();
        setTimeout(function() {
          $("#notYT").hide();
        }, 3000)
      }
    }

    $scope.bingoChar = function(p) {
      p = p == undefined? 0: p;
      v = p > 5? 5: p;
      return "BINGO".substr(0, v).split("").join(" ") + "(" + p + ")";
    }

    var tableRows = function(map) {
      return map.split("").reduce(function(list, ch) {
        list.cur += ch;
        list.index += 1;
        if(list.index % 5 == 0) {
          list.list.push(list.cur);
          list.cur = "";
        }
        return list;
      }, {
        'list': [],
        'cur': "",
        'index': 0
      })['list'];
    }

    var init =  function() {

      $scope.alphabet = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      $scope.winingMsg = undefined;
      $("#notYT").hide();
      $scope.rowz = [];

      // localStorage.setItem('user', JSON.stringify($scope.user));
      socket = io();

      socket.emit('start_game', {
        id: $routeParams.id,
        name: $routeParams.name
      });

      socket.on('res_json', function(data) {
        console.log("res_json");
        console.log(data);
        $scope.user = data.self;
        $scope.opponent = data.opponent;
        $scope.game = data.game;
        $scope.rowz = tableRows(data.self.map);
        $scope.stat = false;
        // $scope.actions = data.game.actions;
        $scope.$apply();
      });

      socket.on('opponent_found', function(data) {
        console.log("opponent_found");
        console.log(data);
        if(data.game == $scope.game.id) {
          $scope.opponent = data.opponent;
          $scope.stat = true;
          $scope.$apply();
        };
      });

      socket.on('action_broadcast', function(data) {
        console.log("action_broadcast");
        console.log(data);
        if(data.game == $scope.game.id) {
          $scope.game.actions = data.actions;
          $scope.points = data.points;
          $scope.stat = data.stat;
          $scope.winingMsg = data.winner;
          $scope.$apply();
        };
      });

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

      .when('/game/:id/:name', {
        templateUrl: pre + 'game.html',
        controller: 'GameCtrl',
      })

      .otherwise({redirectTo: '/'});

  }]);