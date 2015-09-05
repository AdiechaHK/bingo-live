var util = require('util');

var Player = function(id, name, gId) {
  this.id = id;
  this.name = name;
  this.game = gId;
  this.map = util.generateString(25, 'B');
}

Player.prototype.points = function(actions) {

  var self = this;

  var figure = actions.split("").reduce(function(fig, ch) {
    var num = 1 << self.map.indexOf(ch);
    fig = fig | num;
  }, 0);

  var lines = [
    31, 992, 31744, 1015808, 32505856,
    1082400, 2164800, 4329600, 8659200, 17318400,
    17043521, 1118480];

  return lines.reduce(function(points, fig) {
    points += (fig == figure & fig)? 1: 0;
  }, 0);

};

var Game = function(id) {
  this.id = id;
  this.status = "waiting";
  this.actions = "";
}

Game.prototype.setPlayer = function(player, order) {
  if(order == 1) {
    this.firstPlayer = player;
  }
  else if(order == 2) {
    this.secondPlayer = player;
    this.status = "running";
  }
};

Game.prototype.getId = function() {
  return this.id;
};

Game.prototype.applyAction = function(ch) {
  if(this.actions.indexOf(ch) !== -1) {
    return false;
  }
  this.actions += ch;
};

Game.create =  function(id) {
  var game = new Game(id);
  Game.list[id] = game;
  return game;
}

Game.list = {};

Game.waitingGame = null;

Game.selectGame = function(id, name) {

  var order = Game.waitingGame == null? 1: 2;

  if(order == 1) {
    var gId = util.generateString(7, 'A');
    while(Game.list.hasOwnProperty(gId)) {
      gId = util.generateString(7, 'A');
    }
    Game.waitingGame = Game.create(gId);
  }

  var player = new Player(id, name, Game.waitingGame.getId());
  Game.waitingGame.setPlayer(player, order);

  if(order == 2) {
    Game.waitingGame = null;
  }

}




moduel = module.exports = Game;