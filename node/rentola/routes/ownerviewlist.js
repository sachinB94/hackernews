exports.ownerviewlist = function(req, res, db, db_static, redis, listId) {
	if (req.session.ownerId) {
		req.session.listId = listId;
		var ObjectId = require('mongodb').ObjectID;
		var async = require('async');
		async.parallel({
			owner: function (callback) {
				redis.hgetall('owner', function (err, owner) {
					callback(err,owner);
				});
			},
			list: function (callback) {
				db.collection('postlisting').findOne({'_id': new ObjectId(listId.toString())}, function (err, list) {
					callback(err,list);
				});
			},
			locality: function (callback) {
				db_static.collection('locality').find().toArray(function (err, locality) {
					callback(err,locality);
				});
			},
			messages: function (callback) {
				db.collection('ownermessage').find({'ownerId': req.session.ownerId}).toArray(function (err, messages) {
					callback(err,messages);
				});
			}
		}, function (err, result) {
			if (!err) {
				result.locality.every(function (location) {
					if (location['_id'] == result.list['locality']) {
						result.list['localityName'] = location['name'];
						return false;
					}
					else {
						return true;
					}
				});

				var messageCount = 0;
				result.messages.forEach(function (message, index) {
					if (new Date(message.ISODate) > new Date(result.owner.lastAccess)) messageCount++;
				});

				if (result.list.type === 'flat') {
					res.render('viewflat', {
						'list': result.list,
						'user': result.owner,
						'locality': result.locality,
						'isOwner': true,
						'messageCount': messageCount
					});
				} else if (result.list.type === 'hostel') {
					res.render('viewhostel', {
						'list': result.list,
						'user': result.owner,
						'locality': result.locality,
						'isOwner': true,
						'messageCount': messageCount
					});
				} else if (result.list.type === 'pg') {
					res.render('viewpg', {
						'list': result.list,
						'user': result.owner,
						'locality': result.locality,
						'isOwner': true,
						'messageCount': messageCount
					});
				} else {
					res.redirect('ownerhome');
				}
			} else {
				res.redirect('/error/1/' + err);
			}
		});
	} else {
		res.redirect('/');
	}
}