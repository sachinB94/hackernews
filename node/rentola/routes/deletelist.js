exports.deletelist = function (req, res, db, listId) {
	var rimraf = require('rimraf');
	var ObjectId = require('mongodb').ObjectID;
	db.collection('postlisting').remove({'_id': new ObjectId(listId)}, function (err) {
		if (!err) {
			rimraf('public/images/' + listId, function (err) {
				if (!err) {
					res.redirect('/ownerhome');
				} else {
					res.redirect('/error/2/' + err);
				}
			});
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}