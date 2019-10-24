'use strict';
const fs = require('fs');
const basic_f = require('./basic_f.js');
const fmlog = require('@waynechang65/fml-consolelog').log;
const usr_mgr = require('./usr_mgr.js').init();
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const c = require('./const_def.js').init();

function _toro_1(_event, _bot, _imgNameWithUrl) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);
	let pic_address = _imgNameWithUrl;

	_bot.getGroupMemberProfile(gID, uID).then((profile) => {
		_event.reply({
			type: 'image',
			originalContentUrl: pic_address,
			previewImageUrl: pic_address })
			.then(() => {	
				fmlog('command_msg',
					['GN:' + groupDB[idx].gname, idx, msg,
						'...' + pic_address.slice(-35), profile.displayName, uID]);
			});
	});
}

function _toro_r1(_event, _bot, _imgfolder) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);
	let filesInFolderCount = 0;

	//fs.readdir('/usr/share/httpd/noindex/images/lb_images/tg1_img',
	fs.readdir('/usr/share/httpd/noindex/images/lb_images/' + _imgfolder,
		function (err, files) { //讀取目錄檔案列表
			if (err) throw err;
			//console.log(files);	//檔案列表內容
			filesInFolderCount = files.length;
			if (filesInFolderCount != 0) {
				//var _testval = 12;
				//console.log(numAddString0(1, 4));
				//console.log(numAddString0(12, 4));
				//console.log(numAddString0(1000, 4));
				//console.log(numAddString0(_testval, 4));
				var minNum = 1;
				var maxNum = filesInFolderCount;
				var randN = basic_f.getRandom(minNum, maxNum);
				var pic_address = c.TOSMM_TORO_PIC_PATH + _imgfolder + '/' +
					basic_f.numAddString0(randN, 4).toString() + '.jpg';
				//console.log(tb_pic_address);
				_bot.getGroupMemberProfile(gID, uID).then((profile) => {
					_event.reply({
						type: 'image',
						originalContentUrl: pic_address,
						previewImageUrl: pic_address })
						.then(() => {	
							fmlog('command_msg',
								['GN:' + groupDB[idx].gname, idx, msg,
									'No.' + randN + '/' + filesInFolderCount, profile.displayName, uID]);
						});
				});
			} else {
				fmlog('error_msg', [s.to_folder, s.to_fnof, msg]);
			}
		}
	);
}

/**
 * [輸入籤的號碼，得到大吉到凶的結果。(1~7)]
 * @param       {[type]} _index [籤的號碼(0~99)]
 * @return      {[type]}        [籤的結果(1~7)]
 */
function _getAsaResult(_index){
	// 日本金龍山淺草觀音寺一百籤
	// http://www.chance.org.tw/
	let asaResult = [
		1, 4, 7, 2, 7, 6, 7, 1, 1, 1,
		1, 1, 1, 6, 7, 1, 7, 2, 5, 2,
		2, 2, 2, 7, 2, 2, 2, 7, 2, 3,
		6, 2, 2, 2, 2, 6, 3, 3, 7, 4,
		6, 2, 2, 2, 2, 7, 2, 4, 2, 2,
		2, 7, 2, 7, 2, 5, 2, 7, 7, 4,
		3, 1, 7, 7, 6, 7, 7, 2, 7, 7,
		7, 2, 2, 7, 7, 2, 7, 1, 2, 1,
		4, 7, 7, 7, 1, 1, 1, 7, 1, 1,
		2, 2, 2, 3, 2, 1, 7, 7, 1, 7];
	return asaResult[_index];
}

function _toro_asa(_event, _bot, _extra) {
	let minNum = 1;
	let maxNum = 100;
	let randN = basic_f.getRandom(minNum, maxNum);
	let pic_address = c.TOSMM_TORO_PIC_PATH_ASA + String(_getAsaResult(randN - 1))+'.png';
	
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);

	if (_extra) {
		pic_address = c.TOSMM_TORO_PIC_PATH_SM_ASA + String(_getAsaResult(randN - 1))+'.jpg';
	}

	_bot.getGroupMemberProfile(gID, uID).then((profile) => {
		_event.reply({
			type: 'image',
			originalContentUrl: pic_address,
			previewImageUrl: pic_address })
			.then(() => {	
				fmlog('command_msg',
					['GN:' + groupDB[idx].gname, idx, msg,
						'No.' + randN + '/' + maxNum, profile.displayName, uID]);
			});
	});
}

function _toro_kuzi(_event, _bot) {
	let minNum = 1;
	let maxNum = 60;
	let randN = basic_f.getRandom(minNum, maxNum);
	let pic_address = c.TOSMM_TORO_PIC_PATH_KUZI + randN.toString() + '.jpg';
	
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);

	_bot.getGroupMemberProfile(gID, uID).then((profile) => {
		_event.reply({
			type: 'image',
			originalContentUrl: pic_address,
			previewImageUrl: pic_address })
			.then(() => {	
				fmlog('command_msg',
					['GN:' + groupDB[idx].gname, idx, msg,
						'No.' + randN + '/' + maxNum, profile.displayName, uID]);
			});
	});
}

//////////////  Module Exports //////////////////
module.exports = {
	toro_1 : _toro_1,
	toro_r1: _toro_r1,
	toro_asa : _toro_asa,
	toro_kuzi : _toro_kuzi
};