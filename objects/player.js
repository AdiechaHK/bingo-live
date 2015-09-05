var util = require('../helper/util');

var Player = function(id, name, gId) {
  this.id = id;
  this.name = name;
  this.game = gId;
  this.map = util.generateString(25, 'B');
}

Player.prototype.getId = function() {
  return this.id;
};

Player.prototype.getName = function() {
  return this.name;
};

Player.prototype.getMap = function() {
  return this.map;
};

Player.prototype.setGame = function(id) {
  this.game = id;
};

Player.prototype.points = function(actions) {

  var self = this;

  var figure = actions.split("").reduce(function(fig, ch) {
    var num = 1 << self.map.indexOf(ch);
    fig = fig | num;
    return fig;
  }, 0);

  var lines = [
    31, 992, 31744, 1015808, 32505856,
    1082401, 2164802, 4329604, 8659208, 17318416,
    17043521, 1118480];

  return lines.reduce(function(points, fig) {
    var mask = figure & fig;
    points += (fig == mask)? 1: 0;
    return points;
  }, 0);

};
  
module = module.exports = Player;