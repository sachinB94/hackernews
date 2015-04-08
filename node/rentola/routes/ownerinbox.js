exports.ownerinbox = function (req, res, db, redis) {
	var ObjectId = require('mongodb').ObjectID;
	var async = require('async');
	async.parallel({
		owner: function (callback) {
			redis.hgetall('owner', function (err, owner) {
				callback(err,owner);
			});
		},
		messages : function (callback) {
			db.collection('ownermessage').find({'ownerId': req.session.ownerId}).toArray(function (err, messages) {
				callback(err,messages);
			});
		},
		lastAccess: function (callback) {
			db.collection('ownerlist').update({'_id': new ObjectId(req.session.ownerId)}, {$set: {'lastAccess': new Date()}}, function (err) {
				callback(err,null);
			});
		}
	}, function (err, result) {
		if (!err) {
			res.render('ownerinbox', {'user': result.owner, 'messages': result.messages, 'messageCount': 0});
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}