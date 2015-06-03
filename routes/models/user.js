(function() {
  var CB = require('cloudboost');

  var _appId = 'hackernews',
      _clientKey = 'mSwylTsb09F6BI4q+qWqpw==';

  CB.CloudApp.init(_appId, _clientKey);

  module.exports = {
    User: function() {
      return new CB.CloudUser();
    },
    currentUser: function() {
      return CB.CloudUser.current;
    },
    logIn: function(user, next) {
      user.logIn({
        success: function(user) {
          return next(null);
        },
        error: function(err) {
          return next(err);
        }
      });
    },
    signUp: function(user, next) {
      user.signUp({
        success: function(user) {
          return next(null);
        },
        error: function(err) {
          return next(err);
        }
      });
    },
    logOut: function(next) {
      CB.CloudUser.current.logOut({
        success: function(user) {
          return next(null); 
        },
        error: function(err) {
          return next(err);
        }  
      });
    }
  }
}());