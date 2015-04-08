exports.add = function (req, res, db) {
	db.collection('favourites').save({'student': req.session.studentId, 'favourite': req.body.listId}, function (err, fav) {
		if (!err) {
			res.json({'err': err});
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}

exports.remove = function (req, res, db) {
	db.collection('favourites').remove({'student': req.session.studentId, 'favourite': req.body.listId}, function (err) {
		if (!err) {
			res.json({'err': err});
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}