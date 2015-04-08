exports.sendmessage = function (req, res, db) {
	var ObjectId = require('mongodb').ObjectID;
	var today = new Date();
	req.body.ISODate = today;
	today = today.toISOString().replace(/T/,'').replace(/\..+/,'');
	req.body.date = today.substr(0,10);
	req.body.time = today.substr(10,8);
	req.body.listId = req.headers.referer.substr(req.headers.referer.length-24, req.headers.referer.length);
	db.collection('postlisting').findOne({'_id': ObjectId(req.body.listId)}, function (err, list) {
		if (!err) {
			req.body.ownerId = list.ownerId;
			db.collection('ownermessage').save(req.body, function (err, message) {
				if (!err) {
					res.redirect(req.headers.referer);
				} else {
					res.redirect('/error/1/' + err);
				}
			});
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}