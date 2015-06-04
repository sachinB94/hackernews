module.exports = function(req, res, next) {
  var login;
  
  var User = require('../models/user.js');
  var Comments = require('../models/comments.js');
  var News = require('../models/news.js');

  // if (!User.currentUser() || Object.keys(User.currentUser()).length === 0) {
  //   login = false;
  // } else {
  //   login = true;
  // }

  if (!User.currentUser(req.session)) {
    login = false;
  } else {
    login = true;
  }

  Comments.get(req.params.news, function(err, comments) {
    if (!err) {
      News.get(req.params.news, function(err, news) {
        if (!err) {
          res.render('comments', {
            login: login,
            currentUser: User.currentUser(req.session),
            news: news,
            comments: comments
          });
        } else {
          res.render('error', { message: err });
        }
      });
    } else {
      res.render('error', { message: err });
    }
  });
}