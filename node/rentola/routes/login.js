exports.owner = function (req, res, db, redis) {
	var email = req.body.email;
	var password = req.body.password;
	db.collection('ownerlist').findOne({'email': email}, function (err,owner) {
		if (!err) {
			if (owner != null) {
				if (owner['password'] === password) {
					redis.hmset('owner', owner);
					req.session.ownerId = owner['_id'];
					res.redirect('ownerhome');
				} else {
					res.redirect('/error/5/' + err);
				}
			} else {
				res.redirect('/error/4/' + err);
			}
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}

exports.student = function (req, res, db, redis) {
	var email = req.body.email;
	var password = req.body.password;
	db.collection('studentlist').findOne({'email': email}, function (err,student) {
		if (!err) {
			if (student != null) {
				if (student['password'] === password) {
					redis.hmset('student', student);
					req.session.studentId = student['_id'];
					res.redirect('studenthome');
				} else {
					res.redirect('/error/5/' + err);
				}
			} else {
				res.redirect('/error/4/' + err);
			}
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}