(function() {
  var CB = require('cloudboost');

  var _appId = 'hackernews',
      _clientKey = 'mSwylTsb09F6BI4q+qWqpw==';

  CB.CloudApp.init(_appId, _clientKey);

  module.exports = {
    Comments: function() {
      return new CB.CloudObject('Comments');
    },
    Query: function() {
      return new CB.CloudQuery('Comments');
    },
    save: function(comment, next) {
      comment.save({
        success: function(comment) {
          return next(null);
        },
        error: function(err) {
          return next(err);
        }
      });
    },
    get: function(news, next) {
      var query = this.Query();
      query.equalTo('news', news);
      query.orderByDesc('createdAt');
      query.find({
        success: function(comments) {
          return next(null, comments);
        },
        error: function(err) {
          return next(err, null);
        }
      });
    }
  }
}());