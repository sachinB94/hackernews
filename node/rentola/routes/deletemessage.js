exports.deletemessage = function (req, res, db, messageId) {
	var ObjectId = require('mongodb').ObjectID;
	db.collection('ownermessage').remove({'_id': new ObjectId(messageId.toString())}, function (err) {
		if (!err) {
			res.redirect('/userhome/ownerinbox');
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}