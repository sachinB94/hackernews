module.exports = function(req, res, next) {
  var User = require('../models/user.js');
  var News = require('../models/news.js');

  if (!User.currentUser() || Object.keys(User.currentUser()).length === 0) {
    res.send({ err: 'Login first to upvote a news.' });
  } else {
    News.upvote(req.body.news, function(err) {
      res.send({ err: err });
    });
  }
}
