module.exports = {
	title: function (req, res, db, db_static, redis) {
		var async = require('async');
		async.parallel({
			locality: function (callback) {
				db_static.collection('locality').find().toArray(function (err, locality) {
					callback(err,locality);
				});
			},
			lists: function (callback) {
				var searchTerm = '.*' + req.query.searchTerm.toLowerCase() + '.*';
				db.collection('postlisting').find({'title': { $regex : searchTerm}}).toArray(function (err, lists) {
					callback(err,lists);
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
			favourites: function (callback) {
				if (req.session.studentId) {
					db.collection('favourites').find({'student': req.session.studentId}).toArray(function (err, favourites) {
						if (!err) {
							var favId = [];
							for (var i=0 ; i<favourites.length ; ++i) {
								favId[i] = favourites[i].favourite;
							}
							callback(err,favId);
						} else {
							callback(err,[]);
						}
					});
				} else {
					callback(null,[]);
				}
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
					'searchAnything': '',
					'deposit': 0,
					'gender': []
				};
				if (req.session.studentId) var isStudent = true;
				else var isStudent = false;
				res.render('index', {
					'lists': result.lists,
					'locality': result.locality,
					'search': search,
					'isStudent': isStudent,
					'user': result.student,
					'favourites': result.favourites
				});
			} else {
				res.redirect('/error/1/' + err);
			}
		});
	},

	searchall: function (req, res, db, db_static, redis) {
		if (typeof req.query.type === 'string') req.query.type = [req.query.type];
		else if (!req.query.type) req.query.type = ['flat', 'pg', 'hostel'];
		
		if (req.query.minRent === '') req.query.minRent = 0;
		if (req.query.maxRent === '') req.query.maxRent = 99999999;
		
		if (typeof req.query.rentType === 'string') req.query.rentType = [req.query.rentType];
		else if (!req.query.rentType) req.query.rentType = ['yearly', 'monthly'];

		if (typeof req.query.ac === 'string') req.query.ac = [req.query.ac];
		else if (!req.query.ac) req.query.ac = ['0', '1'];

		if (typeof req.query.gender === 'string') req.query.gender = [req.query.gender];
		else if (!req.query.gender) req.query.gender = ['male', 'female', 'both'];
		else req.query.gender = ['both']
		
		if (typeof req.query.furnishing === 'string') req.query.furnishing = [req.query.furnishing];
		else if (!req.query.furnishing) req.query.furnishing = ['furnished', 'semi-furnished', 'unfurnished'];

		if (typeof req.query.bhk === 'string') req.query.bhk = [parseInt(req.query.bhk)];
		else if (!req.query.bhk) req.query.bhk = [1,2,3,4,5,6];
		else {
			req.query.bhk = req.query.bhk.map(function (bhk) {
				return parseInt(bhk);
			});
		}

		if (typeof req.query.seater == 'string') req.query.seater = [parseInt(req.query.seater)];
		else if (!req.query.seater) req.query.seater = [1,2,3,4,5,6];
		else {
			req.query.seater = req.query.seater.map(function (seater) {
				return parseInt(seater);
			});
		}

		if (typeof req.query.availability === 'string') req.query.availability = [req.query.availability];
		else if (!req.query.availability) req.query.availability = ['1','0'];
		
		if (req.query.floor === '') req.query.floor = '[\\s\\S]*';
		
		if (req.query.noBathroom === '') req.query.noBathroom = '[\\s\\S]*';
		
		if (typeof req.query.attachedBathroom === 'string') req.query.attachedBathroom = [req.query.attachedBathroom];
		else if (!req.query.attachedBathroom) req.query.attachedBathroom = ['1','0'];

		req.query.searchAnything = '';

		db_static.collection('locality').find().toArray(function (err, locality) {
			if (!err) {
				if (typeof req.query.locality === 'string') req.query.locality = [req.query.locality];
				else if (!req.query.locality) {
					req.query.locality = [];
					for (var i=0 ; i<locality.length ; ++i)
						req.query.locality[i] = locality[i]._id.toString();
				}

				db.collection('postlisting').find({$or: [
					{
						'type': { $in: req.query.type },
						'locality': { $in: req.query.locality },
						'rent.0.rent': { $lt: parseInt(req.query.maxRent) , $gt: parseInt(req.query.minRent) },
						'rent.0.rentType': { $in : req.query.rentType },
						'furnishing': { $in : req.query.furnishing },
						'bhk': { $in: req.query.bhk },
						'availability': { $in: req.query.availability },
						'floor': { $regex: req.query.floor },
						'noBathroom': { $regex: req.query.noBathroom },
						'attachedBathroom': { $in: req.query.attachedBathroom }
					},
					{
						'type': { $in: req.query.type },
						'locality': { $in: req.query.locality },
						$and: [
							{ $or: [
								{'rent.0.rent': { $lt: parseInt(req.query.maxRent) , $gt: parseInt(req.query.minRent) }},
								{'rent.1.rent': { $lt: parseInt(req.query.maxRent) , $gt: parseInt(req.query.minRent) }},
								{'rent.2.rent': { $lt: parseInt(req.query.maxRent) , $gt: parseInt(req.query.minRent) }},
								{'rent.3.rent': { $lt: parseInt(req.query.maxRent) , $gt: parseInt(req.query.minRent) }},
								{'rent.4.rent': { $lt: parseInt(req.query.maxRent) , $gt: parseInt(req.query.minRent) }},
								{'rent.5.rent': { $lt: parseInt(req.query.maxRent) , $gt: parseInt(req.query.minRent) }}
							]},
							{ $or: [
								{'rent.0.rentType': { $in : req.query.rentType }},
								{'rent.1.rentType': { $in : req.query.rentType }},
								{'rent.2.rentType': { $in : req.query.rentType }},
								{'rent.3.rentType': { $in : req.query.rentType }},
								{'rent.4.rentType': { $in : req.query.rentType }},
								{'rent.5.rentType': { $in : req.query.rentType }}
							]},
							{ $or: [
								{'rent.0.ac': { $in : req.query.ac }},
								{'rent.1.ac': { $in : req.query.ac }},
								{'rent.2.ac': { $in : req.query.ac }},
								{'rent.3.ac': { $in : req.query.ac }},
								{'rent.4.ac': { $in : req.query.ac }},
								{'rent.5.ac': { $in : req.query.ac }}
							]},
							{ $or: [
								{'rent.0.seat': { $in : req.query.seater }},
								{'rent.1.seat': { $in : req.query.seater }},
								{'rent.2.seat': { $in : req.query.seater }},
								{'rent.3.seat': { $in : req.query.seater }},
								{'rent.4.seat': { $in : req.query.seater }},
								{'rent.5.seat': { $in : req.query.seater }}
							]}
						],
						'furnishing': { $in : req.query.furnishing },
						'availability': { $in: req.query.availability },
						'attachedBathroom': { $in: req.query.attachedBathroom }
					}
				]}).toArray(function (err, lists) {
					if (!err) {
						lists.sort(function (a, b) {
							return compareStrings(a.title, b.title);
						});
						if (req.session.studentId) {
							redis.hgetall('student', function (err, student) {
								if (!err) {
									db.collection('favourites').find({'student': req.session.studentId}).toArray(function (err, favourites) {
										if (!err) {
											var favId = [];
											for (var i=0 ; i<favourites.length ; ++i) {
												favId[i] = favourites[i].favourite;
											}

											res.render('index', {
												'lists': lists,
												'locality': locality,
												'search': req.query,
												'isStudent': true,
												'user': student,
												'favourites': favId
											});
										} else {
											res.redirect('/error/1/' + err);
										}
									});
								} else {
									res.redirect('/error/3/' + err);
								}
							});
						} else {
							res.render('index', {
								'lists': lists,
								'locality': locality,
								'search': req.query,
								'isStudent': false,
								'user': null,
								'favourites': []
							});
						}
					} else {
						res.redirect('/error/1/' + err);
					}
				});
			} else {
				res.redirect('/error/1/' + err);
			}
		});
	},

	searchanything : function (req, res, db, db_static, redis) {
		var searchTerm  = req.query.searchTerm;
		var searchAnything =  searchTerm;
		searchTerm = searchTerm.replace(/[&\/\\#@,+()$~%.'":*?<>{}]/g,'.*').toLowerCase();
		searchTerm = '.*' + searchTerm + '.*';
		db_static.collection('locality').find().toArray(function (err, locality) {
			if (!err){
				var localityId = [];
				var i = 0;
				locality.forEach(function (location) {
					if (location.name === searchTerm) {
						localityId[i] = location._id.toString();
						i++;
					}
				});
				db.collection('postlisting').find({
					$or: [
						{'locality': { $in: localityId }},
 						{'title' : { $regex: searchTerm }},
 						{'furnishing' : {$regex: searchTerm }},
 						{'type': { $regex: searchTerm }},
 						{'rentType': { $regex: searchTerm }},
 						{'address' : {$regex: searchTerm }},
 					]
 				}).toArray(function (err, lists){
					if (!err) {
						lists.sort(function (a, b) {
							return compareStrings(a.title, b.title);
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
							'deposit': 0,
							'gender': [],
							'searchAnything': searchAnything
						};
						if (req.session.studentId) {
							redis.hgetall('student', function (err, student) {
								if (!err) {
									db.collection('favourites').find({'student': req.session.studentId}).toArray(function (err, favourites) {
										if (!err) {
											var favId = [];
											for (var i=0 ; i<favourites.length ; ++i) {
												favId[i] = favourites[i].favourite;
											}
											res.render('index', {
												'lists': lists,
												'locality': locality,
												'search': search,
												'isStudent': true,
												'user': student,
												'favourites': favId
											});
										} else {
											res.redirect('/error/1/' + err);
										}
									});
								} else {
									res.redirect('/error/3/' + err);
								}
							});
						} else {
							res.render('index', {
								'lists': lists,
								'locality': locality,
								'search': search,
								'isStudent': false,
								'user': null,
								'favourites': []
							});
						}
					} else {
						res.redirect('/error/1/' + err);
					}
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