module.exports = function(req, res, next) {
  var User = require('../models/user.js');
  var News = require('../models/news.js');
  var news = News.News();

  news.set('title', req.body.title);
  news.set('link', req.body.link);
  news.set('description', req.body.description);
  news.set('postedBy', {
    _id: User.currentUser(req.session)._id,
    username: User.currentUser(req.session).username
  });
  news.set('points', 0);

  News.save(news, function(err, news) {
    res.send({
      news: news,
      err: err
    });
  });

}
