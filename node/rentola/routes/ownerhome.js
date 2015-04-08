exports.ownerhome = function (req, res, db, db_static, redis) {
	if (req.session.listId) {
		req.session.listId = null;
	}
	if (req.session.ownerId) {
		var async = require('async');
		async.parallel({
			locality: function (callback) {
				db_static.collection('locality').find().toArray(function (err, locality) {
					callback(err,locality);
				});
			},
			owner: function (callback) {
				redis.hgetall('owner', function (err, owner) {
					callback(err,owner);
				});
			},
			lists: function (callback) {
				db.collection('postlisting').find({'ownerId': req.session.ownerId}).toArray(function (err, lists) {
					callback(err,lists);
				});
			},
			messages: function (callback) {
				db.collection('ownermessage').find({'ownerId': req.session.ownerId}).toArray(function (err, messages) {
					callback(err,messages);
				});
			}
		}, function (err, result) {
			if (!err) {
				var messageCount = 0;
				result.messages.forEach(function (message, index) {
					if (new Date(message.ISODate) > new Date(result.owner.lastAccess)) messageCount++;
				});
				res.render('ownerhome', {
					'locality': result.locality,
					'user': result.owner,
					'lists': result.lists,
					'messageCount': messageCount,
					'isOwner': true,
					'isStudent': false
				});
			} else {
				res.redirect('/error/1/' + err);
			}
		});
	} else {
	 	res.redirect('/');
	}
}


// exports.ownerhome = function (req, res, db, db_static, redis) {
// 	if (req.session.listId) {
// 		req.session.listId = null;
// 	}
// 	if (req.session.ownerId) {
// 		db_static.collection('locality').find().toArray(function (err, locality) {
// 			if (locality != null) {
// 				redis.hgetall('owner', function (err, owner) {
// 					if (!err) {
// 						db.collection('postlisting').find({'ownerId': req.session.ownerId}).toArray(function (err, lists) {
// 							if (!err) {
// 								res.render('ownerhome', {'locality': locality, 'owner': owner, 'lists': lists});
// 							} else {
// 								console.log('ERROR: ' + err);
// 								res.end();
// 							}
// 						});
// 					} else {
// 						console.log('ERROR: ' + err);
// 						res.end();
// 					}
// 				});
// 			} else {
// 				console.log('ERROR: ' + err);
// 				//res.redirect('errorHandle/1');
// 				res.end();
// 			}
// 		});
// 	} else {
// 	 	res.redirect('/');
// 	}
// }