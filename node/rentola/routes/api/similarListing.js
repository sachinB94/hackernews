exports.getSimilarListing = function (db, inputList, callback) {
	var ObjectId = require('mongodb').ObjectID;
	var rentFactor = 0;
	if (inputList.rentType === 'yearly') inputList.rentType = 1;
	else inputList.rentType = 0.2;
	console.log('inputList.bhk+1 = ' + (inputList.bhk+1));
	console.log('inputList.bhk-1 = ' + (inputList.bhk-1));
	db.collection('postlisting').find({
		'_id': { $ne: new ObjectId(inputList._id.toString())},
		'gender': inputList.gender,
		'rent': { $lte: inputList.rent + (10000*inputList.rentType), $gte: inputList - (10000*inputList.rentType)},
		'bhk': { $lte: inputList.bhk+1, $gte: inputList.bhk-1}
	}).toArray(function (err, list) {
		if (list.length === 3) {
			if (inputList.rentType === 1) inputList.rentType = 'yearly';
			else inputList.rentType = 'monthly';
			callback(err,list); 
		} else if (list.length > 3) {
			// specializeLevel1(inputList, list, function (splist, sendPrevious) {
			// 	if (sendPrevious === true) callback(err,list);
			// 	else callback(err,splist);
			// });
			if (inputList.rentType === 1) inputList.rentType = 'yearly';
			else inputList.rentType = 'monthly';
			callback(err,list);
		} else {
			console.log('go to genrelized case');
			if (inputList.rentType === 1) inputList.rentType = 'yearly';
			else inputList.rentType = 'monthly';
			callback(err,list);
		}
	});
}

function specializeLevel1(inputList, prevList, callback) {
	var curList = [];
	prevList.forEach(function (list) {
		if (list.gender === inputList.gender &&
			list.rent <= inputList.rent + (6000*inputList.rentType) &&
			list.rent >= inputList.rent - (6000*inputList.rentType) &&
			list.bhk === inputList.bhk
		) curList.push(list);
	});

	if (curList.length === 3) callback(curList,false);
	else if (curList.length < 3) callback(null,true);
	else {
		specializeLevel2(inputList, curlist, function (nextlist, sendPrevious) {
			callback(nextlist,sendPrevious);
		});
	}
}

function specializeLevel2(inputList, prevList, callback) {
	var curList = [];
	prevList.forEach(function (list) {
		if (list.gender === inputList.gender &&
			list.rent <= inputList.rent + (3000*inputList.rentType) &&
			list.rent >= inputList.rent - (3000*inputList.rentType) &&
			list.bhk === inputList.bhk &&
			list.locality === inputList.locality
		) curList.push(list);
	});

	if (curList.length === 3) callback(curList,false);
	else if (spList.length < 3) callback(null,true);
	else {
		specializeLevel3(inputList, curlist, function (nextlist, sendPrevious) {
			callback(nextlist,sendPrevious);
		});
	}
}

function specializeLevel3(inputList, prevList, callback) {
	var curList = [];
	prevList.forEach(function (list) {
		if (list.gender === inputList.gender &&
			list.rent <= inputList.rent + (1000*inputList.rentType) &&
			list.rent >= inputList.rent - (1000*inputList.rentType) &&
			list.bhk === inputList.bhk &&
			list.locality === inputList.locality &&
			list.noBathroom === inputList.noBathroom
		) curList.push(list);
	});

	if (curList.length === 3) callback(curList,false);
	else if (spList.length < 3) callback(null,true);
	else callback([curList[0], curList[1], curList[2]], false);
}