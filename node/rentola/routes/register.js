exports.owner = function (req, res, db, redis) {
	var registerData = req.body;
	registerData['registerOn'] = new Date();
	registerData['lastAccess'] = registerData['registerOn'];
	db.collection('ownerlist').findOne({'email': req.body.email}, function (err,owner) {
		if (!err) {
			if (owner === null) {
				db.collection('ownerlist').save( registerData, function (err,owner) {
					if (!err) {
						redis.hmset('owner', owner);
						req.session.ownerId = owner['_id'];
						res.redirect('ownerhome');
					} else {
						res.redirect('/error/1/' + err);
					}
				});
			} else {
				res.redirect('/error/6/' + err);
			}
		} else {
			res.redirect('/error/1/' + err);
		}
	});
};

exports.student = function (req, res, db, redis) {
	var registerData = req.body;
	registerData['registerOn'] = new Date();
	registerData['lastAccess'] = registerData['registerOn'];
	db.collection('studentlist').findOne({'email': req.body.email}, function (err,student) {
		if (!err) {
			if (student === null) {
				db.collection('studentlist').save( registerData, function (err,student) {
					if (!err) {
						redis.hmset('student', student);
						req.session.studentId = student['_id'];
						res.redirect('studenthome');
					} else {
						res.redirect('/error/1/' + err);
					}
				});
			} else {
				res.redirect('/error/6/' + err);
			}
		} else {
			res.redirect('/error/1/' + err);
		}
	});
};