module.exports = function(req, res, next) {
  var User = require('../models/user.js');
  var user = User.User();

  user.set('username', req.body.username);
  user.set('email', req.body.email);
  user.set('password', req.body.password);

  User.signUp(user, function(err) {
    res.send({ err: err });
  });
}
