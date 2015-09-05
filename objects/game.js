var util = require('../helper/util');

var Game = function(id) {
  this.id = id == undefined? util.generateString(7, 'A'): id;
  this.actions = "";
}

Game.prototype.setPlayer = function(player, order) {
  if(order == 1) {
    this.firstPlayer = player;
  }
  else if(order == 2) {
    this.secondPlayer = player;
  }
};

Game.prototype.getOpponent = function(id) {
  return (this.firstPlayer == id? this.secondPlayer: this.firstPlayer);
};

Game.prototype.getPlayer = function(order) {
  if(order == 1) {
    return this.firstPlayer;
  } else if(order == 2) {
    return this.secondPlayer;
  } else {
    return null;
  }
};

Game.prototype.addActionChar = function(ch) {
  this.actions += ch;
};

Game.prototype.getActions = function() {
  return this.actions;
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

module.exports = Game;