module.exports = function(req, res, next) {
  var User = require('../models/user.js');
  var user = User.User();

  user.set('username', req.body.username);
  user.set('password', req.body.password);

  User.logIn(user, req.session, function(err) {
    res.send({ err: err });
  });
}
