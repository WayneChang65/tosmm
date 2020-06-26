'use strict';

const fs = require('fs');
const json5 = require('json5');
const fmlog = require('@waynechang65/fml-consolelog').log;
const basic_f = require('./basic_f.js');
const flex_gstatus = require('./flex_gstatus.js');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const c = require('./const_def.js').init();

let groupDB_path = '../json/group_db.json';
let groupDB_save_path = './json/group_db.json';
let groupDB;

let usrDB_path = '../json/user_db.json';
let usrDB_save_path = './json/user_db.json';
const user_db = require(usrDB_path);
let usrDB = user_db;

// 功能：取得傳入gGroupObj對應Group ID的陣列位子。
// 參數：_gid：Group ID
//      _groupObj：傳入全域gGroupObj。
//      這裏用傳入gGroupObj只是為了讓這函式獨立，未來可能有機會讓別的物件使用。
function _getGroupObjArrayIndex(_gid, _groupObj) {
	let current_gid = _gid;
	let currentGroup_idx;
	let i = 0;
	if ((current_gid !== undefined) && (current_gid !== '')){
		for(i = 0; i < _groupObj.length; i++){
			if (_groupObj[i].gid === current_gid) currentGroup_idx = i;
		}
	}
	return currentGroup_idx;
}

// 輸入uid取得uid在usrObj陣列的index
function _getUserObjArrayIndex(_uid, _usrObj) {
	if (_uid) {
		for (let i = 0; i < _usrObj.length; i++) {
			if (_usrObj[i].uid === _uid) return i;
		}
	}
	throw new Error('_getUserObjArrayIndex: Error.');
}


function _saveDB_toJSON(_db, _fname_with_path, _msg_ary){
	return new Promise((resolve, reject) => {
		fs.writeFile(_fname_with_path, JSON.stringify(_db), function(err){
		// 下面這行，測試錯誤用！(搭配JEST)
		//fs.writeFile(null, JSON.stringify(_db), function(err){
			if(err) {
				reject(err);
			} else {
				let dbName = _fname_with_path.split('.');
				if (dbName[dbName.length - 1] === '/json/group_db'){
					groupDB = _db;
				}else if(dbName[dbName.length - 1] === '/json/user_db'){
					usrDB = _db;
				}
				fmlog('sys_msg', _msg_ary);
				resolve(true);
			}
		});
	});
}

// 功能：針對各群組的群組管理員進行設定
// 參數：_msg，傳入的訊息字串
//      _event，line訊息事件物件
// 回傳：成功設定 回傳 idx，失敗回傳 null
async function _handler_groupMgrSetting(_event, _gGroupObj) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let idx_g = _getGroupObjArrayIndex(gID, _gGroupObj);

	// 目前只限定 小妹測試空間 這個群組才能設定 (idx === 0)
	// 另外，JEST TEST 也是用 idx === 0
	// idx === 551 是 火妍測試群組
	if (idx_g != 0 && idx_g != c.TOSMM_SU_GIDX) return null;

	// 把輸入的訊息字串，用空白分開成陣列
	let msgArray = msg.split(' ').map(function (val){
		return val.trim();  // 把字串前後空白去掉    
	});

	let noSpaceMsgArray = new Array();
	for (let i = 0; i < msgArray.length; i++){
		if (msgArray[i] != '') noSpaceMsgArray.push(msgArray[i]);
	}
	
	// Check輸入是否資料不足
	// 正確的輸入格式為：w管理者設定 12 U76c78ee9bc01aa935e1666346ba10539 撒旦666
	// 所以，noSpaceMsgArray應該要有 4 項資料才對。
	if (noSpaceMsgArray.length !== 4) return null;
	
	let group_Idx = parseInt(noSpaceMsgArray[1]);
	// 正確的輸入格式為：w管理者設定 群組流水編號 管理者UID 管理者名稱
	// 例：w管理者設定 12 U76c78ee9bc01aa935e1666346ba10539 快樂的人666
	if (noSpaceMsgArray[0] == 'w管理者設定'){
		if (group_Idx < _gGroupObj.length){
			_gGroupObj[group_Idx].mgr_id =  noSpaceMsgArray[2];
			_gGroupObj[group_Idx].mgr_name =  noSpaceMsgArray[3];
			fmlog('basic_msg', ['w管理者設定', noSpaceMsgArray[3], s.um_setok, '']);
			await _saveGDB(_gGroupObj);
		}else{
			fmlog('error_msg', ['w管理者設定', s.um_setfail, ' ']);
			return null;
		}
	// 正確的輸入格式為：w群組資訊設定 群組流水編號 群組名稱 群組目前人數	
	// 例：w群組資訊設定 2 快樂群組 212
	}else if(noSpaceMsgArray[0] == 'w群組資訊設定'){
		if (group_Idx < _gGroupObj.length){
			_gGroupObj[group_Idx].gname =  noSpaceMsgArray[2];
			_gGroupObj[group_Idx].no_members = parseInt(noSpaceMsgArray[3]);
			fmlog('basic_msg', ['w群組資訊設定', noSpaceMsgArray[2], s.um_setgok, '']);
			await _saveGDB(_gGroupObj);
		}else{
			fmlog('error_msg', ['w群組資訊設定', s.um_setgfail, ' ']);
			return null;
		}
	}else{
		return null;
	}
	return group_Idx;
}


// 功能：handle群組全域物件，判斷是不是新的群組，如果是新的，就建立物件並加入全域陣列
// 參數：_msg, 輸入訊息
//      _event, line訊息事件物件
async function _handler_groupObj(_event, _gGroupObj) {
	let i;
	let noExist = true;
	let cmdCatched = false;
	// 如果群組全域物件陣列沒任何物件，就直接建立物件
	if (_gGroupObj.length == 0){
		_gGroupObj.push(_createNewGroupObj(_event));
		await _saveGDB(_gGroupObj);
		cmdCatched = true;
	}else{	// 如果群組全域物件陣列裏面已經有物件
		for (i = 0; i < _gGroupObj.length; i++){
			// 如果進來群組id與全域群組物件裏的沒有相同，表示是新的，就建立物件。
			if (_gGroupObj[i].gid === _event.source.groupId){
				noExist = false;
				// 把最後一次群組發訊的time stamp給壓上，以後好確認哪個群組是沒在動的。
				let _gDateTime = basic_f.getCurrentDateTime();
				_gGroupObj[i].last_talking = _gDateTime;
				_gGroupObj[i].is_alive = true; // 只要有講話，代表群組還活著
			}
		}
		if (noExist == true){
			_gGroupObj.push(_createNewGroupObj(_event));
			await _saveGDB(_gGroupObj);
			cmdCatched = true;
		}
	}
	return cmdCatched;
}

// 功能：針對傳入的Line訊息事件，如果是group發的，就建立一個物件
// 參數：_event, line事件物件
function _createNewGroupObj(_event) {
	let _obj = {};
	let _gDateTime = basic_f.getCurrentDateTime();

	if ((_event.source.groupId !== undefined) && (_event.source.groupId !== '')){
		_obj.gid = _event.source.groupId;
		_obj.sw_push_weather = false;
		_obj.sw_push_tosInfo_due = true;
		_obj.gname = 'unknowGN';
		_obj.manager = 'unknowID';
		_obj.sw_tg = true;
		_obj.sw_tb = true;
		_obj.sw_toro = true;
		_obj.join_date = _gDateTime;
		_obj.no_members = 100;
		_obj.last_talking = '2018-??-?? (?) ??:??:??';
		_obj.is_alive = true;
		_obj.mgr_id = '???';
		_obj.mgr_name = '???';
		_obj.sw_asa = true;
		_obj.sw_kuzi = true;
		_obj.tosmm_ai_reaction = true;
		_obj.sw_tfhouse = true;
		_obj.sw_ptt = false;
		_obj.sw_baha = false;
		_obj.sw_tos = false;
		_obj.sw_g8g = false;
		_obj.sw_ptt_1 = true;
		_obj.sw_baha_1 = true;
		_obj.sw_tos_1 = true;
		_obj.sw_g8g_1 = true;
		_obj.p2r_msgs = [];
		_obj.p2r_sw = {};
		_obj.p2r_sw.announce = true;
		_obj.p2r_sw.weather = false;
		_obj.p2r_msg_weather = '';
		_obj.p2r_msg_ptt = '';
		_obj.p2r_msg_baha = '';
		_obj.p2r_msg_tos = '';
		_obj.p2r_msg_g8g = '';
		_obj.p2r_sw.ptt = false;
		_obj.p2r_sw.baha = false;
		_obj.p2r_sw.tos = true;
		_obj.p2r_sw.g8g = true;
		_obj.sw_level = true;
		
	}
	return _obj;
}

function _cmdOnOffCheck(_event) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let groupDB = _getGDB();
	let idx = _getGIDX(gID);

	let returnVal = false;

	switch (msg) {
	case '抽美女':
		returnVal = groupDB[idx].sw_tg ? true : false;
		break;
	
	case '抽帥哥':
		returnVal = groupDB[idx].sw_tb ? true : false;
		break;
	
	case '運勢':
	case '超人運勢':	
		returnVal = groupDB[idx].sw_asa ? true : false;
		break;
	
	case '抽籤':
		returnVal = groupDB[idx].sw_kuzi ? true : false;
		break;
	
	case '抽':
	case '抽超人':	
	case '加倍抽':
	case '抽十':
	case '加倍抽十':
	case '抽好抽滿':		//case '抽好抽滿2':
	case '加倍抽好抽滿':	//case '加倍抽好抽滿2':
		returnVal = groupDB[idx].sw_toro ? true : false;
		break;

	case '開房':
		returnVal = groupDB[idx].sw_tfhouse ? true : false;
		break;

	case '1:on': 	case '1:off':	
	case '3:on': 	case '3:off':
	case '4:on': 	case '4:off':
	case '5:on': 	case '5:off':
	case '6:on': 	case '6:off':
	case '7:on': 	case '7:off':
	case '8:on': 	case '8:off':
	case '9:on': 	case '9:off':
	case '11:on': 	case '11:off':
	case '12:on': 	case '12:off':
	case '13:on': 	case '13:off':
	//case '14:on': 	case '14:off':
	case '121:on': 	case '121:off':
	case '122:on': 	case '122:off':
	case '123:on': 	case '123:off':
	//case '124:on': 	case '124:off':
	case '131:on': 	case '131:off':	
		if (groupDB[idx].mgr_id !== '???' &&
			_event.source.userId !== groupDB[idx].mgr_id) {
			returnVal = false;
			//msgR = '您不是土司小妹的群組管理者，無法更動此設定！';	
		}else{
			returnVal = true;
			//msgR = '抽美女【OFF】';
		}
		break;
	// 以下指令為 無開關控制
	case '抽卡機率':
	case '加倍機率':
	case '土司小妹':
	case '小妹指令':
	case '群組指令':
	case '群組狀態':
	case '小妹請私':
	case '天氣':	case 'weather':	case '今日天氣':
	case 'ptt':		case 'Ptt':		case 'PTT':
	case '巴哈':	case 'baha':	case 'BAHA': 	case 'Baha':
	case 'tos': 	case 'TOS': 	case 'Tos':
	case 'g8g': 	case 'G8G': 	case 'G8g':
	case '本週活動':	case 'week':	case 'WEEK':	case 'Week':
		returnVal = true;
		break;

	default:
		break;
	}
	return returnVal;
}

function _getGroupStatus(_event, _bot) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = _getGDB();
	let idx = _getGIDX(gID);

	let msgR = flex_gstatus.msg(groupDB[idx].mgr_name,
		[
			groupDB[idx].p2r_sw.weather,
			groupDB[idx].sw_tg,
			groupDB[idx].sw_tb,
			groupDB[idx].sw_toro,
			groupDB[idx].sw_kuzi,
			groupDB[idx].sw_asa,
			groupDB[idx].tosmm_ai_reaction,
			groupDB[idx].sw_tfhouse,
			groupDB[idx].sw_ptt_1,
			groupDB[idx].sw_baha_1,
			groupDB[idx].sw_tos_1,
			groupDB[idx].sw_g8g_1,

			groupDB[idx].p2r_sw.ptt,
			groupDB[idx].p2r_sw.baha,
			groupDB[idx].p2r_sw.tos,
			groupDB[idx].p2r_sw.g8g,

			groupDB[idx].sw_level
		]);

	_bot.getGroupMemberProfile(gID, uID).then((profile) => {
		_event.reply(msgR)
			.then(() => {
				fmlog('command_msg',
					['GN:' + groupDB[idx].gname, idx, msg,
						s.um_query, profile.displayName, uID
					]);
			});
	});
}

function _setGroupStatus(_event, _bot) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = _getGDB();
	let idx = _getGIDX(gID);

	let msgR;

	switch (msg) {
	case '1:on':
		groupDB[idx].p2r_sw.weather = true;
		msgR = s.um_weather + '【ON】';
		break;
	case '1:off':
		groupDB[idx].p2r_sw.weather = false;
		msgR = s.um_weather + '【OFF】';
		break;	
	case '3:on':
		groupDB[idx].sw_tg = true;
		msgR = s.um_tg + '【ON】';
		break;
	case '3:off':
		groupDB[idx].sw_tg = false;
		msgR = s.um_tg + '【OFF】';
		break;
	case '4:on':
		groupDB[idx].sw_tb = true;
		msgR = s.um_tb + '【ON】';
		break;
	case '4:off':
		groupDB[idx].sw_tb = false;
		msgR = s.um_tb + '【OFF】';
		break;
	case '5:on':
		groupDB[idx].sw_toro = true;
		msgR = s.um_ttos + '【ON】';
		break;
	case '5:off':
		groupDB[idx].sw_toro = false;
		msgR = s.um_ttos + '【OFF】';
		break;
	case '6:on':
		groupDB[idx].sw_kuzi = true;
		msgR = s.um_kuzi + '【ON】';
		break;
	case '6:off':
		groupDB[idx].sw_kuzi = false;
		msgR = s.um_kuzi + '【OFF】';
		break;
	case '7:on':
		groupDB[idx].sw_asa = true;
		msgR = s.um_asa + '【ON】';
		break;
	case '7:off':
		groupDB[idx].sw_asa = false;
		msgR = s.um_asa + '【OFF】';
		break;		
	case '8:on':
		groupDB[idx].tosmm_ai_reaction = true;
		msgR = s.um_mmai + '【ON】';
		break;
	case '8:off':
		groupDB[idx].tosmm_ai_reaction = false;
		msgR = s.um_mmai + '【OFF】';
		break;
	case '9:on':
		groupDB[idx].sw_tfhouse = true;
		msgR = s.um_tf + '【ON】';
		break;
	case '9:off':
		groupDB[idx].sw_tfhouse = false;
		msgR = s.um_tf + '【OFF】';
		break;

	case '11:on':
		groupDB[idx].sw_ptt_1 = true;
		msgR = s.um_newptt + '【ON】';
		break;
	case '11:off':
		groupDB[idx].sw_ptt_1 = false;
		msgR = s.um_newptt + '【OFF】';
		break;
	case '12:on':
		groupDB[idx].sw_baha_1 = true;
		msgR = s.um_newbaha + '【ON】';
		break;
	case '12:off':
		groupDB[idx].sw_baha_1 = false;
		msgR = s.um_newbaha + '【OFF】';	
		break;
	case '13:on':
		groupDB[idx].sw_tos_1 = true;
		msgR = s.um_newtos + '【ON】';
		break;
	case '13:off':
		groupDB[idx].sw_tos_1 = false;
		msgR = s.um_newtos + '【OFF】';		
		break;
	case '14:on':
		groupDB[idx].sw_g8g_1 = true;
		msgR = s.um_newg8g + '【ON】';
		break;
	case '14:off':
		groupDB[idx].sw_g8g_1 = false;
		msgR = s.um_newg8g + '【OFF】';		
		break;
		
	case '121:on':
		groupDB[idx].p2r_sw.ptt = true;
		msgR = s.um_autoptt + '【ON】';
		break;
	case '121:off':
		groupDB[idx].p2r_sw.ptt = false;
		msgR = s.um_autoptt + '【OFF】';
		break;
	case '122:on':
		groupDB[idx].p2r_sw.baha = true;
		msgR = s.um_autobaha + '【ON】';
		break;
	case '122:off':
		groupDB[idx].p2r_sw.baha = false;
		msgR = s.um_autobaha + '【OFF】';
		break;
	case '123:on':
		groupDB[idx].p2r_sw.tos = true;
		msgR = s.um_autotos + '【ON】';
		break;
	case '123:off':
		groupDB[idx].p2r_sw.tos = false;
		msgR = s.um_autotos + '【OFF】';	
		break;
	case '124:on':
		groupDB[idx].p2r_sw.g8g = true;
		msgR = s.um_autog8g + '【ON】';
		break;
	case '124:off':
		groupDB[idx].p2r_sw.g8g = false;
		msgR = s.um_autog8g + '【OFF】';	
		break;
	case '131:on':
		groupDB[idx].sw_level = true;
		msgR = s.um_level + '【ON】';
		break;
	case '131:off':
		groupDB[idx].sw_level = false;
		msgR = s.um_level + '【OFF】';	
		break;			
	default:
		break;
	}
	_bot.getGroupMemberProfile(gID, uID).then((profile) => {
		_event.reply(msgR)
			.then(() => {	
				fmlog('command_msg',
					['GN:' + groupDB[idx].gname, idx, msg,
						msgR, profile.displayName, uID]);
				_saveGDB(groupDB);
			});
	});
}

async function _saveNewUserInfo(_event/*, _bot*/) {
	let groupID = _event.source.groupId;
	let userID = _event.source.userId;
	let newUserID = true;

	for (let i = 0; i < usrDB.length; i++){
		if (usrDB[i].uid === userID){  // 已存在的 uid
			if (usrDB[i].gids.includes(groupID)){ // 已存在的 gid
				//console.log('uid存在、gid存在');
				return false;
			}else{  // uid存在、gid不存在 ==> 儲存gid
				usrDB[i].gids.push(groupID);
				fmlog('sys_msg', [s.um_usrmgr, s.um_uidok]);
				await _saveUDB(usrDB);
			}
			newUserID = false;
			//console.log('uid存在、gid不存在');
			return true;
		}else{  // uid不存在 ==> 儲存 uid 及 gid
		}
	}

	if (newUserID === true){
		let newObj = {};
		newObj.uid = userID;
		newObj.gids = [];
		newObj.username = '';
		newObj.pic = '';
		newObj.levelsys = {	// 經驗值/活躍值
			speaking: 	0,
			pic: 		0,
			tosmm: 		0,
			exp:		0,
			percent:	0,
			lv:			0,
			upgrade:	false
		};
		newObj.gids.push(groupID);
		usrDB.push(newObj);
		fmlog('sys_msg', [s.um_usrmgr, s.um_uidnok]);
		await _saveUDB(usrDB);
		//console.log('uid不存在、gid不存在');
		return true;
	}
}

// 回傳總 User ID數，亦即 使用者總人數
function _getTotalUsersCount() {
	return usrDB.length;
}

// 輸入群組GID，取得該群組發過言的總人數
function _getUsersCountInGroup(_gID) {
	let numberOfTotal = 0;
	for (let i = 0; i < usrDB.length; i++){
		if (usrDB[i].gids.includes(_gID)){ // 已存在的 gid
			numberOfTotal++;
		}
	}
	return numberOfTotal;
}

async function _modify_userDB() {
	try {
		for (let i = 0; i < usrDB.length; i++) {
			usrDB[i].username = '';
			usrDB[i].pic = '';
			usrDB[i].levelsys = {	// 經驗值/活躍值
				speaking: 	0,
				pic: 		0,
				tosmm: 		0,
				exp:		0,
				percent:	0,
				lv:			0,
				upgrade:	false
			};
		}
		await _saveUDB(usrDB);
		return true;
	} catch(err) {
		return Promise.reject(err);
	}
}

async function _modify_groupDB_level() {
	try {
		let groupDB = _getGDB();
		for (let i = 0; i < groupDB.length; i++) {
			groupDB[i].sw_level = true;
		}
		await _saveGDB(groupDB);
		return true;
	} catch(err) {
		return Promise.reject(err);
	}
}

/*..........................................................................*/
/*..........................Public Functions................................*/
/*..........................................................................*/

function _init(_groupDB_path = '../json/group_db.json',
	_groupDB_save_path = './json/group_db.json') {

	groupDB_path = _groupDB_path;
	groupDB_save_path = _groupDB_save_path;
	groupDB = require(groupDB_path);
	return this;
}

function _getGDB() {
	return groupDB;
}

function _getUDB() {
	return usrDB;
}

// 利用gid取得groupDB陣列的 index位置
function _getGIDX(_gid) {
	return _getGroupObjArrayIndex(_gid, groupDB);
}

// 利用uid取得usrDB陣列的 index位置
function _getUIDX(_gid) {
	return _getUserObjArrayIndex(_gid, usrDB);
}

async function _saveGDB(_gDB) {
	try {
		groupDB = _gDB;
		return await _saveDB_toJSON(_gDB, groupDB_save_path, [s.um_json, s.um_wdbok]);
	} catch(err) {
		return Promise.reject(err);
	}
}

async function _saveUDB(_uDB) {
	try {
		usrDB = _uDB;
		return await _saveDB_toJSON(_uDB, usrDB_save_path, [s.um_json, s.um_wanadbok]);
	} catch(err) {
		return Promise.reject(err);
	}
}

async function _setGroupMgr(_event) {
	try {
		let retValue = await _handler_groupMgrSetting(_event, groupDB);
		return retValue;
	} catch(err) {
		return Promise.reject(err);
	}
}

async function _maintainGDB(_event) {
	try {
		let retValue = await _handler_groupObj(_event, groupDB);
		return retValue;
	} catch(err) {
		return Promise.reject(err);
	}
}

// 統計土司小妹使用情況的主要函式，包含收集資料
async function _maintainUDB(_event) {
	try {
		let retValue = await _saveNewUserInfo(_event);
		return retValue;
	} catch(err) {
		return Promise.reject(err);
	}
}

function _getAllGroupSimpleInfo(_event, _isAlive) {
	let i;
	let strGroup1 = '', strGroup2 = '', strGroup3 = '', strGroup4 = '', strGroup5 = '';
	let strGroup6 = '', strGroup7 = '', strGroup8 = '', strGroup9 = '', strGroup10 = '';
	let aryGroupInfo = []; 
	for (i = 0; i < groupDB.length; i++){
		if(_isAlive == true && groupDB[i].is_alive != true) continue;
		if(_isAlive == false && groupDB[i].is_alive != false) continue;

		if (i < 100){
			strGroup1 += i + '：' + groupDB[i].gname + '-' + groupDB[i].is_alive + '\n';
		}else if(i >= 100 && i < 200){	
			strGroup2 += i + '：' + groupDB[i].gname + '-' + groupDB[i].is_alive + '\n';
		}else if(i >= 200 && i < 300){	
			strGroup3 += i + '：' + groupDB[i].gname + '-' + groupDB[i].is_alive + '\n';
		}else if(i >= 300 && i < 400){	
			strGroup4 += i + '：' + groupDB[i].gname + '-' + groupDB[i].is_alive + '\n';
		}else if(i >= 400 && i < 500){	
			strGroup5 += i + '：' + groupDB[i].gname + '-' + groupDB[i].is_alive + '\n';
		}else if(i >= 500 && i < 600){	
			strGroup6 += i + '：' + groupDB[i].gname + '-' + groupDB[i].is_alive + '\n';
		}else if(i >= 600 && i < 700){		
			strGroup7 += i + '：' + groupDB[i].gname + '-' + groupDB[i].is_alive + '\n';
		}else if(i >= 700 && i < 800){		
			strGroup8 += i + '：' + groupDB[i].gname + '-' + groupDB[i].is_alive + '\n';
		}else if(i >= 800 && i < 900){		
			strGroup9 += i + '：' + groupDB[i].gname + '-' + groupDB[i].is_alive + '\n';
		}else if(i >= 900 && i < 1000){		
			strGroup10 += i + '：' + groupDB[i].gname + '-' + groupDB[i].is_alive + '\n';						
		}else{
			// ... 總群組數超過1000個群組後，Code要改
			fmlog('error_msg', [s.um_usrmgr, s.um_glist01, s.um_gnumover1000]);
		}
	}
	aryGroupInfo.push(strGroup1, strGroup2, strGroup3, strGroup4, strGroup5,
		strGroup6, strGroup7, strGroup8, strGroup9, strGroup10);
	aryGroupInfo = aryGroupInfo.filter(function(x){ return x; });	// 濾掉空字串元素

	return aryGroupInfo;
}
//////////////  Module Exports //////////////////
module.exports = {
	init : _init,
	
	getGDB : _getGDB,
	getUDB : _getUDB,
	getGIDX : _getGIDX,
	getUIDX : _getUIDX,
	saveGDB: _saveGDB,
	saveUDB: _saveUDB,

	setGroupMgr : _setGroupMgr,
	maintainGDB : _maintainGDB,
	cmdOnOffCheck : _cmdOnOffCheck,
	getGroupStatus : _getGroupStatus,
	setGroupStatus :_setGroupStatus,
	maintainUDB : _maintainUDB,
	getTotalUsersCount : _getTotalUsersCount,
	getUsersCountInGroup : _getUsersCountInGroup,
	getAllGroupSimpleInfo : _getAllGroupSimpleInfo,


	modify_userDB: _modify_userDB,
	modify_groupDB_level: _modify_groupDB_level
};