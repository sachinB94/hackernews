module.exports = function(req, res, next) {
  var User = require('../models/user.js');
  var Comments = require('../models/comments.js');

  var comment = Comments.Comments();

  comment.set('comment', req.body.comment);
  comment.set('news', req.body.news);
  comment.set('postedBy', {
    _id: User.currentUser(req.session)._id,
    username: User.currentUser(req.session).username
  });

  Comments.save(comment, function(err) {
    res.send({ err: err });
  });

}
