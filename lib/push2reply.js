'use strict';
//const fs = require('fs');
const usr_mgr = require('./usr_mgr.js').init();
const fmlog = require('@waynechang65/fml-consolelog').log;

/////////////////////////////////////////////////////////////////////
// 整個 push2reply的想法如下：                                      
// 用意：因為Line官方帳號2.0的改版，免費的push量從無限制變成 500則/月  
//      由於目前一百多個群組，預估有1萬個成員的情況下，push一次訊息，  
//      就等於一次push 1萬則訊息。(立馬把額度用光)
//
// 問題：未來要對各群組發送公告訊息怎麼辨？或是一些訊息推送怎麼辨？
//
// 解決：利用每個群組都有人會發言的特性，使用reply代替push.(reply無上限)
//
// 做法：
//   1. 設計一個函式傳入event(含gID)，然後在函式裏檢查該gID是否還有沒公
//      佈的訊息？
//    ．如果有，就reply出去，並且清除掉該gID DB的訊息資料，
//      然後結束event傳送流程。(後面指令判斷，就全跳過)
//    ．如果無，就正常跑後面流程。
/////////////////////////////////////////////////////////////////////


let _m_gGroupObj;   // 群組全域物件

// 功能：push2reply物件初始化
// 參數：_groupObj：傳入全域gGroupObj。
// 回傳：this物件 (this代表module.exports)
function _init() {	
	_m_gGroupObj = usr_mgr.getGDB();
	return this;
}

// 功能：整個 pus2reply 功能的主要函式。check是否有訊息需要reply.
// 參數：_event：linebot事件物件
//      _groupObj：傳入全域gGroupObj。
// 回傳：true: 有資料reply, false: 沒資料reply
function _handler_push2reply(_event/*, _bot*/) {
	let gID = _event.source.groupId;
	let idx = usr_mgr.getGIDX(gID);
	let idx_g = idx;
	
	if (_m_gGroupObj[idx_g].p2r_msgs.length != 0 || _m_gGroupObj[idx_g].p2r_msg_weather != '' ||
		_m_gGroupObj[idx_g].p2r_msg_ptt != '' || _m_gGroupObj[idx_g].p2r_msg_baha != '' ||
		_m_gGroupObj[idx_g].p2r_msg_tos != '' || _m_gGroupObj[idx_g].p2r_msg_g8g != '') {

		let msgArray = _m_gGroupObj[idx_g].p2r_msgs;
		if (_m_gGroupObj[idx_g].p2r_msg_weather) msgArray.push(_m_gGroupObj[idx_g].p2r_msg_weather);
		if (_m_gGroupObj[idx_g].p2r_msg_ptt) msgArray.push(_m_gGroupObj[idx_g].p2r_msg_ptt);
		if (_m_gGroupObj[idx_g].p2r_msg_baha) msgArray.push(_m_gGroupObj[idx_g].p2r_msg_baha);
		if (_m_gGroupObj[idx_g].p2r_msg_tos) msgArray.push(_m_gGroupObj[idx_g].p2r_msg_tos);
		if (_m_gGroupObj[idx_g].p2r_msg_g8g) msgArray.push(_m_gGroupObj[idx_g].p2r_msg_g8g);

		_event.reply(msgArray).then(() => {
			_m_gGroupObj[idx_g].p2r_msgs.length = 0;
			_m_gGroupObj[idx_g].p2r_msg_weather = '';
			_m_gGroupObj[idx_g].p2r_msg_ptt = '';
			_m_gGroupObj[idx_g].p2r_msg_baha = '';
			_m_gGroupObj[idx_g].p2r_msg_tos = '';
			_m_gGroupObj[idx_g].p2r_msg_g8g = '';
			fmlog('basic_msg', ['P2R', 'POP', 'Reply msgs to group', _m_gGroupObj[idx_g].gname]);
			_save(_m_gGroupObj);
		});
		return true;
	} else {
		return false;
	}
}

// 功能：將 1 個需要公告的訊息加入 所有 群組的message array裏
// 參數：_msg：訊息內容
//      _groupObj：傳入全域gGroupObj。
// 回傳：this物件 (this代表module.exports)
function _add_announceMsg(_msg) {
	for (let i = 0; i < _m_gGroupObj.length; i++) {
		if (_m_gGroupObj[i].is_alive == true && _m_gGroupObj[i].p2r_sw.announce == true)
			_m_gGroupObj[i].p2r_msgs.push(_msg);
	}
	fmlog('basic_msg', ['P2R', 'PUSH', 'Add announceMsg.', '']);
	return this;
}

// 功能：將 1 個訊息加入 以某種type加入 某個群組中
// 參數：_type：訊息型態
//      _gIdx :群組物件編號 
//      _msg  :訊息內容
//      _groupObj：傳入全域gGroupObj。
// 回傳：this物件 (this代表module.exports)
function _add_aP2RMsg_to_aGroup(_type, _gIdx, _msg) {
	switch (_type) {
	case 'announce':
		_m_gGroupObj[_gIdx].p2r_msgs.push(_msg);
		break;
	case 'weather':
		_m_gGroupObj[_gIdx].p2r_msg_weather = _msg;
		break;
	case 'ptt':
		_m_gGroupObj[_gIdx].p2r_msg_ptt = _msg;
		break;
	case 'baha':
		_m_gGroupObj[_gIdx].p2r_msg_baha = _msg;
		break;
	case 'tos':
		_m_gGroupObj[_gIdx].p2r_msg_tos = _msg;
		break;
	case 'g8g':
		_m_gGroupObj[_gIdx].p2r_msg_g8g = _msg;
		break;
	default:
		break;
	}
	fmlog('basic_msg', ['P2R', 'PUSH', 'Add' + _type + ' msg.', _m_gGroupObj[_gIdx].gname]);
	return this;
}

// 功能：清除所有群組有關 p2r 的所有資料，回到初始值
// 參數：_groupObj：傳入全域gGroupObj。
// 回傳：this物件 (this代表module.exports)
function _clearAll_p2rMsgs() {
	for (let i = 0; i < _m_gGroupObj.length; i++) {
		if(_m_gGroupObj[i].p2r_msgs) _m_gGroupObj[i].p2r_msgs.length = 0;
		if(_m_gGroupObj[i].p2r_msg_weather) _m_gGroupObj[i].p2r_msg_weather = '';
		if(_m_gGroupObj[i].p2r_msg_ptt) _m_gGroupObj[i].p2r_msg_ptt = '';
		if(_m_gGroupObj[i].p2r_msg_baha) _m_gGroupObj[i].p2r_msg_baha = '';
		if(_m_gGroupObj[i].p2r_msg_tos) _m_gGroupObj[i].p2r_tos = '';
		if(_m_gGroupObj[i].p2r_msg_g8g) _m_gGroupObj[i].p2r_msg_g8g = '';
	}
	fmlog('basic_msg', ['P2R', 'CLEAR', 'Clear all P2R msgs.', '']);
	return this;
}

// 功能：清除某個特定群組的所有 p2r資料，回到初始值
// 參數：_gIdx :群組物件編號 
//      _groupObj：傳入全域gGroupObj。
// 回傳：this物件 (this代表module.exports)
function _clearGroup_p2rMsgs(_gIdx) {
	if(_m_gGroupObj[_gIdx].p2r_msgs) _m_gGroupObj[_gIdx].p2r_msgs.length = 0;
	if(_m_gGroupObj[_gIdx].p2r_msg_weather) _m_gGroupObj[_gIdx].p2r_msg_weather = '';
	if(_m_gGroupObj[_gIdx].p2r_msg_ptt) _m_gGroupObj[_gIdx].p2r_msg_ptt = '';
	if(_m_gGroupObj[_gIdx].p2r_msg_baha) _m_gGroupObj[_gIdx].p2r_msg_baha = '';
	if(_m_gGroupObj[_gIdx].p2r_msg_tos) _m_gGroupObj[_gIdx].p2r_tos = '';
	if(_m_gGroupObj[_gIdx].p2r_msg_g8g) _m_gGroupObj[_gIdx].p2r_msg_g8g = '';
	fmlog('basic_msg', ['P2R', 'CLEAR', 'Clear all P2R msgs.', _m_gGroupObj[_gIdx].gname]);
	return this;
}

function _save(_gDB) {
	usr_mgr.saveGDB(_gDB);
}

//////////////  Module Exports //////////////////
module.exports = {
	m_gGroupObj : _m_gGroupObj,
	init: _init,
	reply : _handler_push2reply,
	add_announceMsg : _add_announceMsg,
	add_aP2RMsg_to_aGroup : _add_aP2RMsg_to_aGroup,
	clearAll_p2rMsgs: _clearAll_p2rMsgs,
	clearGroup_p2rMsgs : _clearGroup_p2rMsgs,
	save : _save
};