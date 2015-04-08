exports.updateprofile = function (req, res, db, redis) {
	var ObjectId = require('mongodb').ObjectID;
	if (req.session.studentId) {
		var userType = 'student';
		var userId = req.session.studentId;
	} else if (req.session.ownerId) {
		var userType = 'owner';
		var userId = req.session.ownerId;
	}
	db.collection(userType + 'list').update({'_id': new ObjectId(userId)}, {$set: req.body}, function (err) {
		if (!err) {
			req.body._id = userId;
			redis.hmset(userType, req.body);
			res.redirect(userType + 'home');
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}

exports.changepassword = function (req, res, db, redis) {
	var ObjectId = require('mongodb').ObjectID;
	if (req.session.studentId) {
		var userType = 'student';
		var userId = req.session.studentId;
	} else if (req.session.ownerId) {
		var userType = 'owner';
		var userId = req.session.ownerId;
	}
	db.collection(userType + 'list').update({'_id': new ObjectId(userId)}, {$set: req.body}, function (err) {
		if (!err) {
			res.redirect(userType + 'home');
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}