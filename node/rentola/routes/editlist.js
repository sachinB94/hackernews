exports.editlist = function (req, res, db) {
	var ObjectId = require('mongodb').ObjectID;
	var list = req.body;
	if (list['rent']) {
		list['rent'] = parseInt(list['rent']);
	}
	if (list['noBathroom']) {
		if (!list['attachedBathroom']) {
			list['attachedBathroom'] = '0';
		}
		if (!list['amenities']) {
			list['amenities'] = '';
		} else if (typeof list['amenities'] === 'string') {
			list['amenities'] = [list['amenities']];
		}
	}	
	
	if (list['rent0'] || list['rent1'] || list['rent2'] || list['rent3'] || list['rent4'] || list['rent5'] || list['rent6']) {
		console.log('in rent');
		list.rent = [];
		list.rentType = [];
		if (list['type'] === 'flat') {
			list.rent.push({seat: 0, rent: parseInt(list['rent0'])});
			list.rentType.push({seat: 0, rentType: list['rentType0']});
			delete list['rent0'];
			delete list['rentType0'];
		} else {
			for (var i=1 ; i<=6 ; ++i) {
				list.rent.push({seat: i, rent: parseInt(list['rent' + i])});
				list.rentType.push({seat: i, rentType: list['rentType' + i]});
				delete list['rent' + i];
				delete list['rentType' + i];
				delete list['ac' + i];
			}
		}
	}

	if (list['ac1'] || list['ac2'] || list['ac3'] || list['ac4'] || list['ac5'] || list['ac6']) {
		console.log('in ac');
		list.ac = [];
		if (list['type'] === 'flat') {
			list.ac.push({seat: 0, ac: list['ac0']});
			delete list['ac0'];
		} else {
			for (var i=1 ; i<=6 ; ++i) {
				list.ac.push({seat: i, ac: list['ac' + i]});
				delete list['ac' + i];
			}
		}
	}

	db.collection('postlisting').update({'_id': new ObjectId(req.session.listId)}, {$set: list}, function (err) {
		if (!err) {
			res.redirect('/ownerhome/' + req.session.listId);
		} else {
			res.redirect('/error/1/' + err);
		}
	});
}