'use strict';
const usr_mgr = require('./usr_mgr.js').init();

/**
 * [取得特定群組的明細資料。包含群組名稱，群組人數，組大頭照連結]
 * @param {event}	_event  [LINE event obj]
 * @param {bot}		_bot 	[BOT obj]
 * @param {string}	_gID 	[要查詢的群組ID]
 */
function _getOneGroupProfile(_event, _bot, _gID) {
	return new Promise((resolve, reject) => {
		_bot.getGroupProfile(_gID).then((result_gProfile) => {
			_bot.getGroupMembersCount(_gID).then((result_mCount) => {	
				result_gProfile.count = result_mCount.count;
				resolve(result_gProfile);
			});
		}).catch((err) => { reject(err); });
	});	
}

/**
 * [Console印出傳入群組的群組明細資料。包含群組名稱，群組人數，群組大頭照連結]
 * @param {event}	_event  	[LINE event obj]
 * @param {bot}		_bot 		[BOT obj]
 * @param {Array}	_aryGIDs 	[要查詢的群組ID，可複數，以字串陣列傳入]
 */
async function _consoleOutGroupProfiles(_event, _bot, _aryGIDs) {
	for (let i = 0; i < _aryGIDs.length; i++) {
		let idx = usr_mgr.getGIDX(_aryGIDs[i]);
		let p = await _getOneGroupProfile(_event, _bot, _aryGIDs[i]);
		if(p.count === undefined) console.log('IDX = '	// 無效群組號碼
			+ idx + '--- Unavaliable group !');
		else console.log(p);
	}
}

/**
 * [取得所有群組明細資料。包含群組名稱，群組人數，群組大頭照連結]
 * @param {event}	_event  	[LINE event obj]
 * @param {bot}		_bot 		[BOT obj]
 */
async function _getAllGroupProfile(_event, _bot) {
	let groupDB = usr_mgr.getGDB();
	let aryGName = [], aryMembersCount = [], aryGPic = [], aryIsAlive = [];
	for (let i = 0; i < groupDB.length; i++) {
		let p = await _getOneGroupProfile(_event, _bot, groupDB[i].gid);
		if(p.count === undefined){ // 無效群組號碼
			aryIsAlive.push(false);
			aryGName.push(undefined);
			aryMembersCount.push(undefined);
			aryGPic.push(undefined);
			console.log('IDX = ' + i + '--- Unavaliable group !');
		} else {
			aryIsAlive.push(true);
			aryGName.push(p.groupName);
			aryMembersCount.push(p.count);
			aryGPic.push(p.pictureUrl);
			console.log(p);
		}
	}
	return {
		isAlive : aryIsAlive, 
		gName : aryGName,
		mCount : aryMembersCount,
		gPicUrl : aryGPic
	};
}

async function _do(_event, _bot) {
	let groupDB = usr_mgr.getGDB();
	let result = await _getAllGroupProfile(_event, _bot);

	for (let i = 0; i < groupDB.length; i++) {
		if (result.isAlive[i]) {
			groupDB[i].is_alive = true;
			groupDB[i].gname = result.gName[i];
			groupDB[i].no_members = result.mCount[i];
			groupDB[i].gpic = result.gPicUrl[i];
		} else {
			groupDB[i].is_alive = false;
			groupDB[i].gpic = '???';
		}
	}
	usr_mgr.saveGDB(groupDB).then(() => {
		// console.log('groupDB is saved !');
	});
}

//////////////  Module Exports //////////////////
module.exports = {
	do : _do,
	getOneGroupProfile : _getOneGroupProfile,
	getAllGroupProfile : _getAllGroupProfile,
	consoleOutGroupProfiles : _consoleOutGroupProfiles,
};