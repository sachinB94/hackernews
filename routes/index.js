module.exports = function(req, res, next) {
  var login;
  var User = require('./models/user.js');
  var News = require('./models/news.js');

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

  News.getAll(req.url, function(err, news) {
    if (!err) {
      res.render('index', { login: login, currentUser: User.currentUser(req.session), news: news });
    } else {
      res.render('error', { message: err });
    }
  });
}