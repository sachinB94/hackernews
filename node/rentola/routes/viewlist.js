exports.viewlist = function(req, res, db, db_static, redis, listId) {
	var ObjectId = require('mongodb').ObjectID;
	var async = require('async');
	async.parallel({
		list: function (callback) {
			db.collection('postlisting').findOne({'_id': new ObjectId(listId) }, function (err, list) {
				callback(err,list);
			});
		},
		locality: function (callback) {
			db_static.collection('locality').find({}).toArray(function (err, locality) {
				callback(err,locality);
			});
		},
		student: function (callback) {
			if (req.session.studentId) {
				redis.hgetall('student', function (err, student) {
					callback(err,student);
				});
			} else {
				callback(null,null);
			}
		},
		isFav: function (callback) {
			if (req.session.studentId) {
				redis.hgetall('student', function (err, student) {
					if (!err) {
						db.collection('favourites').findOne({'favourite': listId, 'student': student._id}, function (err, list) {
							callback(err, list != null);
						});
					} else {
						callback(err,null);
					}
				});
			} else {
				callback(null,null);
			}
		},
		owner: function (callback) {
			db.collection('postlisting').findOne({'_id': new ObjectId(listId) }, function (err, list) {
				if (!err) {
					db.collection('ownerlist').findOne({'_id': new ObjectId(list.ownerId) }, function (err, owner) {
						callback(err,owner);
					});
				} else {
					callback(err,null);
				}
			});
		}
	}, function (err, result) {
		if (!err) {
			result.locality.every(function (location) {
				if (location['_id'] == result.list['locality']) {
					result.list['localityName'] = location['name'];
					return false;
				} else {
					return true;
				}
			});
			var search = {
				'type': [],
				'locality': [],
				'minRent': 0,
				'maxRent': 99999999,
				'rentType': [],
				'ac': [],
				'furnishing': [],
				'bhk': [],
				'seater': [],
				'availability': [],
				'floor': '[\\s\\S]*',
				'noBathroom': '[\\s\\S]*',
				'attachedBathroom': [],
				'deposit': '',
				'gender': [],
				'searchAnything': ''
			};
			var isStudent;
			if (req.session.studentId) isStudent = true;
			else isStudent = false;
		
			if (result.list.type === 'flat') {
				res.render('viewflat', {
					'list': result.list,
					'locality': result.locality,
					'isOwner': false,
					'isStudent': isStudent,
					'user': result.student,
					'user': result.owner,
					'search': search,
					'isFav': result.isFav,
				});
			} else if (result.list.type === 'hostel') {
				res.render('viewhostel', {
					'list': result.list,
					'locality': result.locality,
					'isOwner': false,
					'isStudent': isStudent,
					'user': result.student,
					'user': result.owner,
					'search': search,
					'isFav': result.isFav,
				});
			} else if (result.list.type === 'pg') {
				res.render('viewpg', {
					'list': result.list,
					'locality': result.locality,
					'isOwner': false,
					'isStudent': isStudent,
					'user': result.student,
					'user': result.owner,
					'search': search,
					'isFav': result.isFav,
				});
			} else {
				res.redirect('/');
			}
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}