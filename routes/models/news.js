(function() {
  var CB = require('cloudboost');

  var _appId = 'hackernews',
      _clientKey = 'mSwylTsb09F6BI4q+qWqpw==';

  CB.CloudApp.init(_appId, _clientKey);

  module.exports = {
    News: function() {
      return new CB.CloudObject('News');
    },
    Query: function() {
      return new CB.CloudQuery('News');
    },
    save: function(news, next) {
      news.save({
        success: function(news) {
          return next(null, news);
        },
        error: function(err) {
          return next(err, null);
        }
      });
    },
    get: function(news, next) {
      var self = this;
      var query = self.Query();
      query.get(news, {
        success: function(news) {
          return next(null, news);
        },
        error: function(err) {
          return next(err, null);
        }
      });
    },
    getAll: function(url, next) {
      var query = this.Query();
      if (url === '/' || url === '/hot') {
        query.orderByDesc('points');
      } else {
        query.orderByDesc('createdAt');
      }
      query.find({
        success: function(news) {
          return next(null, news);
        },
        error: function(err) {
          return next(err, null);
        }
      });
    },
    delete: function(news, next) {
      news.delete({
        success: function(news) {
          return next(null, news);
        },
        error: function(err) {
          return next(err, null);
        }
      });
    },
    upvote: function(newsId, next) {
      var self = this;
      self.get(newsId, function(err, news) {
        if (err) {
          return next(err);
        } else  {
          news.document.points++;
          self.save(news, function(err) {
            return next(err);
          });
        }
      });
    },
    downvote: function(newsId, next) {
      var self = this;
      self.get(newsId, function(err, news) {
        if (err) {
          return next(err);
        } else  {
          if (news.document.points === 0) {
            return next('Points are already 0. No further downvoting is possible.');
          } else {
            news.document.points--;
            self.save(news, function(err) {
              return next(err);
            });
          }
        }
      });
    }
  }
}());