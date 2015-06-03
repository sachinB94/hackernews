module.exports = function(req, res, next) {
  require('../models/user.js').logOut(function (err) {
    if (err) {
      res.send({ err: err });
    } else {
      res.redirect('/');
    }
  });
}
