exports.logout = function (req, res, db, redis) {
	var ObjectId = require('mongodb').ObjectID;
	var async = require('async');
	async.parallel([
		function (callback) {
			redis.del('owner', function (err, nDel) {
				callback(err);
			});
		},
		function (callback) {
			redis.del('student', function (err,nDel) {
				callback(err);
			});
		},
		function (callback) {
			db.collection('ownerlist').update({'_id': new ObjectId(req.session.ownerId)}, {$set: {'lastAccess': new Date()}}, function (err) {
				callback(err);
			});
		}
	], function (err){
		if (!err) {
			req.session.destroy();
			console.log('Logged out');
			res.redirect('/');
		} else {
			res.redirect('/error/1/' + err);
		}
	});
};