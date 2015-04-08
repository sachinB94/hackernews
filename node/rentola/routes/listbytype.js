exports.listbytype = function (req, res, redis) {
	var basicFlatInfo = req.body;
	redis.hmset('basicFlatInfo', basicFlatInfo);
	redis.hgetall('owner', function (err, owner) {
		if (!err) {
			if (basicFlatInfo['type'] === 'flat') {
				res.render('flatform', {'user': owner});
			} else if (basicFlatInfo['type'] === 'pg') {
				res.render('pgform', {'user': owner});
			} else {
				res.render('hostelform', {'user': owner});
			}
		} else {
			res.redirect('/error/3/' + err);
		}
	});
}