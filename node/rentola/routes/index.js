exports.index =  function (req, res, db, db_static, redis) {
	if (req.session.ownerId) {
		res.redirect('ownerhome');
	} else {
		var async = require('async');
		async.parallel({
			locality: function (callback) {
				db_static.collection('locality').find().toArray(function (err, locality) {
					callback(err,locality);
				});
			},
			lists: function (callback) {
				db.collection('postlisting').find({}).toArray(function (err, lists) {
					if (req.query.sortBy == 2) {
						lists.sort(function (a, b) {
							return minimum(a.rent) - minimum(b.rent);
						});
					} else if (req.query.sortBy == 3) {
						lists.sort(function (a, b) {
							return minimum(b.rent) - minimum(a.rent);
						});
					} else {
						lists.sort(function (a, b) {
							return compareStrings(a.title, b.title);
						});
					}
					callback(err,lists);
				});
			},
			student: function (callback) {
				redis.exists('student', function (err,exist) {
					if (exist === 1) {
						redis.hgetall('student', function (err, student) {
							callback(err,student);
						});
					} else {
						callback(null,null);
					}
				});
			},
			favourites: function (callback) {
				redis.exists('student', function (err,exist) {
					if (exist === 1) {
						db.collection('favourites').find({'student': req.session.studentId}).toArray(function (err, favourites) {
							var favId= [];
							for (var i=0 ; i<favourites.length ; ++i) {
								favId[i] = favourites[i].favourite;
							}
							callback(err,favId);
						});
					} else {
						callback(null,[]);
					}
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
					'ac': [],
					'furnishing': [],
					'bhk': [],
					'seater': [],
					'availability': [],
					'floor': '[\\s\\S]*',
					'noBathroom': '[\\s\\S]*',
					'attachedBathroom': [],
					'deposit': '',
					'gender': []
				};
				var isStudent;
				if (req.session.studentId) isStudent = true;
				else isStudent = false;
				res.render('index', {
					'lists': result.lists,
					'locality': result.locality,
					'search': search,
					'user': result.student,
					'isStudent': isStudent,
					'favourites': result.favourites,
					'messageCount': 0
				});
			} else {
				res.redirect('/error/1/' + err);
			}
		});
	}
}

function compareStrings (a, b) {
	a = a.toLowerCase();
	b = b.toLowerCase();
	return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function minimum (a, b) {
	return Math.min.apply(Math,a.map (function (o) {
		return isNaN(o.rent) ? 999999 : o.rent;
	}));
}