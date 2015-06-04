(function() {
  var CB = require('cloudboost');

  var _appId = 'hackernews',
      _clientKey = 'mSwylTsb09F6BI4q+qWqpw==';

  CB.CloudApp.init(_appId, _clientKey);

  module.exports = {
    User: function() {
      return new CB.CloudUser();
    },
    currentUser: function(session) {
      if (session === undefined) return null;
      else return session.user;
      // return CB.CloudUser.current;
    },
    logIn: function(user, session, next) {
      user.logIn({
        success: function(user) {
          session.user = {
            _id: user.document._id,
            username: user.document.username
          };
          return next(null);
        },
        error: function(err) {
          return next(err);
        }
      });
    },
    signUp: function(user, session, next) {
      user.signUp({
        success: function(user) {
          session.user = {
            _id: user._id,
            username: user.username
          };
          return next(null);
        },
        error: function(err) {
          return next(err);
        }
      });
    },
    logOut: function(session, next) {
      session.destroy(function(err) {
        return next(err);
      });
      // CB.CloudUser.current.logOut({
      //   success: function(user) {
      //     return next(null); 
      //   },
      //   error: function(err) {
      //     return next(err);
      //   }  
      // });
    }
  }
}());