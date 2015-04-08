exports.postlisting = function (req, res, db, redis) {
	var ObjectId = require('mongodb').ObjectID;
	redis.hgetall('basicFlatInfo', function (err, basicFlatInfo) {
		if (!err) {
			var formidable = require('formidable');
			var fs   = require('fs-extra');

			var flat = {};
			var form = new formidable.IncomingForm();
			form.parse(req, function (err, fields, files) {
				flat = fields;
			});
			form.on('end', function (fields, files) {
				var receivedFiles = this.openedFiles;
				var today = new Date().toISOString().replace(/T/,'').replace(/\..+/,'');
				flat['type'] = basicFlatInfo['type'];
				flat['title'] = basicFlatInfo['title'].toLowerCase();
				flat['address'] = basicFlatInfo['address'];
				flat['locality'] = basicFlatInfo['locality'];
				flat['deposit'] = basicFlatInfo['deposit'];
				flat['gender'] = basicFlatInfo['gender'];
				flat['furnishing'] = basicFlatInfo['furnishing'];
				flat['bhk'] = parseInt(flat['bhk']);
				flat['availability'] = '1';
				flat['listedOnDate'] = today.substr(0,10);
				flat['listedOnTime'] = today.substr(10,8);
				flat['ownerId'] = req.session.ownerId;
				if (!flat['attachedBathroom']) flat['attachedBathroom'] = '0';
				
				if (basicFlatInfo['amenities']) flat['amenities'] = basicFlatInfo['amenities'].split(',');
				else flat['amenities'] = [];
				
				flat.rent = [];
				
				if (flat['type'] === 'flat') {
					flat.rent.push({seat: 0, rent: parseInt(flat['rent0']), rentType: flat['rentType0']});
					delete flat['rent0'];
					delete flat['rentType0'];
				} else {
					for (var i=1 ; i<=6 ; ++i) {
						if (flat['rent' + i]) {
							flat.rent.push({seat: i, rent: parseInt(flat['rent' + i]), rentType: flat['rentType' + i], ac: flat['ac' + i]});
						}
						delete flat['rent' + i];
						delete flat['rentType' + i];
						delete flat['ac' + i];
					}
				}

				db.collection('postlisting').save(flat, function (err, list) {
					if (!err) {
						redis.del('basicFlatInfo', function (err, nDel) {
							if (!err) {
								var image = [];
								var temp = 0;
								for (var i=0 ; i<receivedFiles.length ; ++i) {
									if (receivedFiles[i].size != 0) {
										temp++;
										var temp_path = receivedFiles[i].path;
										var file_name = receivedFiles[i].name;
										var new_location = 'public/images/' + list._id + '/';
										image.push('/images/' + list._id + '/' + file_name);
										fs.copy(temp_path, new_location + file_name, function (err) {  
											if (err) {
												console.log('ERROR: ' + err);
												res.end();
											}
										});
									}
								}
								if (temp === 0) {
									image.push('/images/noimage.jpg')
								}
								db.collection('postlisting').update({'_id': new ObjectId(list._id.toString())}, {$set: {'image': image}}, function (err) {
									if (!err) {
										res.redirect('ownerhome');
									} else {
										console.log('ERROR: ' + err);
										res.end()
									}
								});
							} else {
								res.redirect('/error/3/' + err);
							}
						});
					} else {
						res.redirect('/error/1/' + err);
					}
				});
			});
		} else {
			res.redirect('/error/3/' + err);
		}
	});
}