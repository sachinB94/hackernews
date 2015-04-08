exports.studenthome = function (req, res, db, db_static, redis) {
	if (req.session.studentId) {
		var ObjectId = require('mongodb').ObjectID;
		var async = require('async');
		async.parallel({
			locality: function (callback) {
				db_static.collection('locality').find().toArray(function (err, locality) {
					callback(err,locality);
				});
			},
			lists: function (callback) {
				redis.hgetall('student', function (err, student) {
					if (!err) {
						db.collection('favourites').find({'student': student._id}).toArray(function (err, favourites) {
							if (!err) {
								var favId = [];
								for (var i=0 ; i<favourites.length ; ++i) {
									favId[i] = new ObjectId(favourites[i].favourite);
								}
								db.collection('postlisting').find({'_id': {$in: favId}}).toArray(function (err, lists) {
									callback(err,lists);
								});
							} else {
								callback(err,favourites);
							}
						});
					} else {
						callback(err,student);
					}
				});
			},
			student: function (callback) {
				redis.hgetall('student', function (err, student) {
					callback(err,student);
				});
			}
		}, function (err, result) {
			if (!err) {
				var search = {
					'type': [],
					'locality': [],
					'minRent': 0,
					'maxRent': 99999999,
					'rentType': [],
					'furnishing': [],
					'bhk': [],
					'availability': [],
					'floor': '[\\s\\S]*',
					'noBathroom': '[\\s\\S]*',
					'attachedBathroom': [],
					'deposit': '',
					'gender': []
				};
				res.render('studenthome', {
					'user': result.student,
					'lists': result.lists,
					'locality': result.locality,
					'isStudent': true,
					'isOwner': false,
					'search': search,
				});
			} else {
				res.redirect('/error/1/' + err);
			}
		});
	} else {
	 	res.redirect('/');
	}
}