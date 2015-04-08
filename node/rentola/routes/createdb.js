exports.createdb =  function (req, res, db_static) {
	var async = require('async');
	var collection = db_static.collection('locality');
	var collectionErr = db_static.collection('errors');
	collection.remove({}, function (err){ 
		async.parallel([
			function (callback) {
				collection.save({'name': 'alpha - I'}, function (err) {
					callback(err);
				});
			},
			function (callback) {
				collection.save({'name': 'alpha - II'}, function (err) {
					callback(err);
				});
			},
			function (callback) {
				collection.save({'name': 'beta - I'}, function (err) {
					callback(err);
				});
			},
			function (callback) {
				collection.save({'name': 'beta - II'}, function (err) {
					callback(err);
				});
			},
			function (callback) {
				collection.save({'name': 'gamma - I'}, function (err) {
					callback(err);
				});
			},
			function (callback) {
				collection.save({'name': 'gamma - II'}, function (err) {
					callback(err);
				});
			},
			function (callback) {
				collection.save({'name': 'delta - I'}, function (err) {
					callback(err);
				});
			},
			function (callback) {
				collection.save({'name': 'Knowledge Park - III'}, function (err) {
					callback(err);
				});
			}
		], function (err) {
			if (!err) {
				collectionErr.remove({}, function (err){ 
					async.parallel([
						function (callback) {
							collectionErr.save({'error': 'Unable to access Database. Please try again later', 'errorCode': '1'}, function (err) {
								callback(err);
							});
						},
						function (callback) {
							collectionErr.save({'error': 'Unable to delete listing.Please try again later', 'errorCode': '2'}, function (err) {
								callback(err);
							});
						},
						function (callback) {
							collectionErr.save({'error': 'Unable to connect to redis server.Please try again later.', 'errorCode': '3'}, function (err) {
								callback(err);
							});
						},
						function (callback) {
							collectionErr.save({'error': 'Username not found.', 'errorCode': '4'}, function (err) {
								callback(err);
							});
						},
						function (callback) {
							collectionErr.save({'error': 'Password does not match.', 'errorCode': '5'}, function (err) {
								callback(err);
							});
						},
						function (callback) {
							collectionErr.save({'error': 'Username already exists.', 'errorCode': '6'}, function (err) {
								callback(err);
							});
						}
					], function (err) {
						if (!err) {
							res.redirect('/');
						} else {
							res.redirect('/error/1/' + err);
						}
					});
				});		
			} else {
				res.redirect('/error/1/' + err);
			}
		});
	});
}