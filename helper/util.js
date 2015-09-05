
var util = function() {}

util.generateString = function(len, type) {

  type = type == undefined? 'N': type;

  var commonFun = function(a, b, unique) {

    var scope = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    unique = unique == undefined? false: unique;  

    var subScope = b == undefined? scope.substr(a): scope.substr(a, b);
    var str = "";

    if(unique) {
      subScopeArr = subScope.split("");
      for (var i = 0; i < len; i++) {
        var indx = Math.round(Math.random()*(subScopeArr.length - 1));
        var pop = subScopeArr.splice(indx, 1);
        str += pop.join("");
      }
    } else {
      subScopeArr = subScope.split("");
      for (var i = 0; i < len; i++) {
        var indx = Math.round(Math.random()*(subScopeArr.length - 1));
        str += subScopeArr[indx];
      }
    }
    return str;
  }

  var fun = {
    'N': function() {
      return commonFun(0, 10);
    },
    'A': function() {
      return commonFun(36);
    },
    'B': function() {
      return commonFun(36, 25, true);
    }
  }

  if(fun.hasOwnProperty(type)) {
    return fun[type]();
  } else {
    return fun['N']();
  }

}

exports = module.exports = util;