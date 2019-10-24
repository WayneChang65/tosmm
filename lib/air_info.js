'use strict';
const request = require('request');
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const c = require('./const_def.js').init();
const usr_mgr = require('./usr_mgr.js').init();

//功能：從政府開放資料取得空氣品質 https://data.gov.tw/dataset/40448
function _getAirInfo(_event, _bot) {
	let url = 'http://opendata.epa.gov.tw/ws/Data/AQI/?$format=json';

	request(url, (err, res, body) => {
		try {
			let groupDB = usr_mgr.getGDB();
			let air_db = JSON.parse(body);
			let area_1 = _getAirColorFlag(parseInt(air_db[53].AQI)) +
				air_db[53].County + '-' + air_db[53].SiteName + '-AQI: ' + air_db[53].AQI;	// 西屯
			let area_2 = _getAirColorFlag(parseInt(air_db[48].AQI)) +
				air_db[48].County + '-' + air_db[48].SiteName + '-AQI: ' + air_db[48].AQI;	// 沙鹿
			let area_3 = _getAirColorFlag(parseInt(air_db[51].AQI)) +
				air_db[51].County + '-' + air_db[51].SiteName + '-AQI: ' + air_db[51].AQI;	// 三義
			let sendMsg = area_1 + '\n\n' + area_2 + '\n\n' + area_3;
			// _event如果是false代表要做push，如果是true，就是reply。用途兩種。
			if (!_event) {
				_bot.push(groupDB[c.TOSMM_SU_GIDX].gid, sendMsg);	// 小妹測試空間-水/火妍(管理者Group)
			}else{
				let msg = _event.message.text;
				let gID = _event.source.groupId;
				let uID = _event.source.userId;
				let idx = usr_mgr.getGIDX(gID);
				_bot.getGroupMemberProfile(gID, uID).then((profile) => {
					_event.reply(sendMsg)
						.then(() => {
							fmlog('command_msg',
								['GN:' + groupDB[idx].gname, idx, msg,
									sendMsg.slice(0,18), profile.displayName, uID
								]);
						});
				});
			}
		}catch(error){
			fmlog('error_msg', [s.air_airinfo, s.air_getinfoerr, '']);
			console.error(error);
		}
	});
}

function _getAirColorFlag(_aqi) {
	let ret = '';
	if (_aqi >= 0 && _aqi < 51){			// 綠-良好
		ret = '\u{1F49A}';
	}else if (_aqi >= 51 && _aqi < 101){	// 黃-普通
		ret = '\u{1F49B}';
	}else if (_aqi >= 101 && _aqi < 151){	// 橘-對敏感族群不健康
		ret = '\u{1F9E1}';
	}else if (_aqi >= 151 && _aqi < 201){	// 紅-對所有族群不健康
		ret = '\u{02764}';
	}else if (_aqi >= 201 && _aqi < 301){	// 紫-非常不健康
		ret = '\u{1F49C}';
	}else if (_aqi >= 301 && _aqi < 501){	// 棕-危害
		ret = '\u{1F5A4}';
	}
	return ret;
}
//////////////  Module Exports //////////////////
module.exports = {
	getAirInfo : _getAirInfo
};