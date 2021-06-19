'use strict';
const c = require('./const_def.js').init();
const { GoogleSpreadsheet } = require('google-spreadsheet');
const g_secret = require(c.TOSMM_GSID_SECRET_PATH_LOCAL + 'client_secret.json');
const usr_mgr = require('./usr_mgr.js').init();
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));

const WTestWater =	{ idx : 0,		// 小妹測試空間(水妍)
	gsid : c.TOSMM_GSID_WTESTWATER };
const SuperMan =	{ idx : 1,		// 超人群組
	gsid : c.TOSMM_GSID_SUPERMAN };
const MaggyBan = 	{ idx : 20,		// 美吉幫
	gsid : c.TOSMM_GSID_MAGGYBAN };
const LiuLung = 	{ idx : 22,		// 流浪者養生會館(明德)
	gsid : c.TOSMM_GSID_LIULUNG };
const YoseiTail = 	{ idx : 28,		// 妖精尾巴(謝小芳)
	gsid : c.TOSMM_GSID_YOSEITAIL };
const FuGuan = 		{ idx : 32,		// 浮光掠影
	gsid : c.TOSMM_GSID_FUGUAN };	
const Aushe = 		{ idx : 52,		// 傲視之界
	gsid : c.TOSMM_GSID_AUSHE };
const WTestFire = 	{ idx : 929,	// 小妹測試空間(火妍)
	gsid : WTestWater.gsid };
	

let gDoc_cc = {};
let gCustomCMD = {};	// 自訂指令的指令部分
let gCustomResult = {};	// 自訂指令的反應內容部分

function _init(_idx) {
	// gDoc_cc對應每個群組編號的GoogleSpreadsheet，針對客製化指令
	let returnVal = false;
	if (_idx === undefined || _idx === WTestWater.idx) 	returnVal = _initBasicData(WTestWater);
	if (_idx === undefined || _idx === SuperMan.idx) 	returnVal = _initBasicData(SuperMan);
	if (_idx === undefined || _idx === MaggyBan.idx) 	returnVal = _initBasicData(MaggyBan);
	if (_idx === undefined || _idx === LiuLung.idx) 	returnVal = _initBasicData(LiuLung);
	if (_idx === undefined || _idx === YoseiTail.idx) 	returnVal = _initBasicData(YoseiTail);
	if (_idx === undefined || _idx === FuGuan.idx) 		returnVal = _initBasicData(FuGuan);
	if (_idx === undefined || _idx === Aushe.idx) 		returnVal = _initBasicData(Aushe);
	if (_idx === undefined || _idx === WTestFire.idx) 	returnVal = _initBasicData(WTestFire);

	return returnVal ? this : null;
}

async function _initBasicData(_groupConst) {
	let sIdx = _groupConst.idx.toString();
	let spreadsheetId = _groupConst.gsid;

	gDoc_cc[sIdx] = new GoogleSpreadsheet(spreadsheetId);
	gCustomCMD[sIdx] = [];
	gCustomResult[sIdx] = [];
	return await _getCustomCmd_FromGoogleSpreadSheet(sIdx);
}

function _reload(_event, _bot) {
	// _event是true代表是reply message, false表示系統排程更新
	if(_event) {
		let msg = _event.message.text;
		let gID = _event.source.groupId;
		let uID = _event.source.userId;
		let idx = usr_mgr.getGIDX(gID);
		let groupDB = usr_mgr.getGDB();
	
		let msgR = (_init(idx) !== null) ? s.cc_loadok2 : s.cc_loaderr2;
	
		_bot.getGroupMemberProfile(gID, uID).then((profile) => {
			_event.reply(msgR)
				.then(() => {
					fmlog('command_msg',
						['GN:' + groupDB[idx].gname, idx, msg,
							msgR, profile.displayName, uID
						]);
				});
		});
	}else{
		// 目前系統排程更新只更新 超人群組
		if(_init(c.GIDX_SUPERMAN) !== null) {
			fmlog('sys_msg', [s.cc_cc, s.cc_autoreload_ok]);
		}else{
			fmlog('error_msg', [s.cc_cc, s.cc_autoreload_err, ' ']);
		}
	}
}

async function _getCustomCmd_FromGoogleSpreadSheet(_idx) {
	let worksheetID = 0; // 自訂指令 這個頁面

	if (!gDoc_cc[_idx]) {
		fmlog('error_msg', ['gSpreadSheet', s.cc_loaderr, ' ']);
		return false;
	}

	try {
		await gDoc_cc[_idx].useServiceAccountAuth(g_secret);
		await gDoc_cc[_idx].loadInfo();
		console.log(gDoc_cc[_idx].title);

		let sheet = gDoc_cc[_idx].sheetsByIndex[worksheetID];
		console.log(sheet.title);
		console.log(sheet.rowCount);

		await sheet.loadCells();
		console.log(sheet.cellStats);

		gCustomCMD[_idx].length = 0;
		gCustomResult[_idx].length = 0;

		for (let i = 0; i < 2; i++) {
			console.log('\n');
			for (let j = 1; j < 1001; j++) {
				let cell = sheet.getCell(j, i);
				if (cell.value != null && 
					(cell.valueType == 'stringValue' || cell.valueType == 'numberValue')) {
					switch (i) {
					case 0: // Command Words
						// string.trim() 主要功能是去掉字串前後的空白
						if(cell.valueType == 'stringValue') gCustomCMD[_idx].push(cell.value.trim());
						else gCustomCMD[_idx].push(cell.value.toString());
						break;
					case 1: // Display Words
						// string.trim() 主要功能是去掉字串前後的空白
						if(cell.valueType == 'stringValue') gCustomResult[_idx].push(cell.value.trim());
						else gCustomResult[_idx].push(cell.value.toString());
						break;
					default:
						break;
					}
					//console.log(i.toString() + '-' + j.toString() + '-' + cell.value);
				}
			}
		}
		console.log('\n\ngCustomCMD = ' + gCustomCMD[_idx] +
			' --- Length = ' + gCustomCMD[_idx].length);
		console.log('_gCustomResult = ' + gCustomResult[_idx] +
			' --- Length = ' + gCustomResult[_idx].length + '\n\n');
		return true;
	} catch (err) {
		fmlog('error_msg', ['gSpreadSheet', err.toString(), gDoc_cc[_idx].title]);
		return false;
	}
}

function _reply(_event, _bot) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);
	let sIdx = idx.toString();

	if(gCustomCMD[sIdx] == undefined) return false;

	msg = msg.trim();
	if (gCustomCMD[sIdx].includes(msg) == false){ 
		// 傳進來指令在自訂指令裏面沒有的話，就 reutrn
		return false;
	}else{
		let msgR = gCustomResult[sIdx][gCustomCMD[sIdx].indexOf(msg)];
		_bot.getGroupMemberProfile(gID, uID).then((profile) => {
			_event.reply(msgR)
				.then(() => {
					// 如果是陣列，就用0號陣列資料做console out
					if (typeof(msgR) === 'object') msgR = msgR[0];
					msgR = msgR.split('\n')[0];
					fmlog('command_msg',
						['GN:' + groupDB[idx].gname, idx, msg,
							msgR.slice(0,18) + '...', profile.displayName, uID]);
				});
		});
		return true;
	}
}

//////////////  Module Exports //////////////////
module.exports = {
	init : _init,
	reply : _reply,
	reload : _reload
};