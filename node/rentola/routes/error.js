exports.error = function (req, res, db_static, errorCode, sysError) {
	db_static.collection('errors').findOne({'errorCode': errorCode}, function (err, userError) {
		if (!err) {
			res.render('errorPage', {
				'sysError': sysError,
				'userError': userError.error
			});
		} else {
			res.redirect('/error/1' + err);
		}
	});
}