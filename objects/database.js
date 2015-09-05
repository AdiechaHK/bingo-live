var Database = function() {
  this.players = [];
  this.games = [];
  this.waiting = null;
}

Database.prototype.findGame = function(id) {
  
  return this.games.reduce(function(result, g) {
    return (g.getId() == id)? g: result;
  }, null);

};

Database.prototype.findPlayer = function(id) {
  
  return this.players.reduce(function(result, p) {
    return (p.getId() == id)? p: result;
  }, null);

};

Database.prototype.hasWaitingGame = function() {
  return (this.waiting != null);
};

Database.prototype.getWaitingGame = function() {
  return this.findGame(this.waiting);
};

Database.prototype.hasGame = function(id) {
  return this.games.reduce(function(result, g) {
    return (g.getId() == id)? true: result;
  }, false);
};

Database.prototype.saveGame = function(game) {

  var self = this;

  var indx = self.games.reduce(function(i, g) {
    return (game.getId() == g.getId())? self.games.indexOf(g): i;
  }, null);

  if(indx != null) {
    self.games.splice(indx, 1);
  }

  self.games.push(game);
};

Database.prototype.savePlayer = function(player) {

  var self = this;

  var indx = self.players.reduce(function(i, p) {
    return (player.getId() == p.getId())? self.players.indexOf(p): i;
  }, null);

  if(indx != null) {
    self.players.splice(indx, 1);
  }

  self.players.push(player);
};

Database.prototype.setWaitingGame = function(id) {
  this.waiting = id;
};

Database.prototype.resetWaitingGame = function() {
  this.waiting = null;
};

Database.prototype.returnResponce = function(gameId, playerId) {

  var game = this.findGame(gameId);
  var player = this.findPlayer(playerId);
  var opId = game.getPlayer(1) == player.getId()? game.getPlayer(2): game.getPlayer(1);
  var opponent = null;
  if(opId != null) {
    opponent = this.findPlayer(opId);
  }

  return {
    self: {
      id: player.getId(),
      name: player.getName(),
      map: player.getMap()
    },
    game: {
      id: game.getId(),
      actions: game.getActions()
    },
    opponent: opponent == null? null: opponent.getName()
  };

};

module.exports = Database;