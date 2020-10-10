'use strict';
const fs = require('fs');
const basic_f = require('./basic_f.js');
const usr_mgr = require('./usr_mgr.js').init();
const push2reply = require('./push2reply.js');
const fmlog = require('@waynechang65/fml-consolelog').log;
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const flex_weather = require('./flex_weather.js');
const air_info = require('./air_info.js');
const temp_info = require('./temp_info.js');

//=================================================
//====== 取得 發佈 Line flex message的發送字串 =====
//=================================================
// 功能：取得 Line flex message 發送字串
// 回傳：line flex message string
// 註：取得空氣 AQI 資訊的速度很慢... (官方取得JSON的問題)
async function _getWeatherString() {
	try{
		let str_temp_info = await temp_info.getTempInfo();
		let aryTemp = str_temp_info.temp.split('-');
		let aryRain = str_temp_info.rain.split('-');

		let str_air_info = await air_info.getAirInfo();
		let aryAir = str_air_info.split('-');

		let area_items = [
			{
				area: s.wea_tpi,
				temp: aryTemp[0],
				rain: aryRain[0],
				aqi: aryAir[0]
			},
			{
				area: s.wea_hsichu,
				temp: aryTemp[1],
				rain: aryRain[1],
				aqi: aryAir[1]
			},
			{
				area: s.wea_tch,
				temp: aryTemp[2],
				rain: aryRain[2],
				aqi: aryAir[2]
			},
			{
				area: s.wea_nto,
				temp: aryTemp[3],
				rain: aryRain[3],
				aqi: aryAir[3]
			},
			{
				area: s.wea_kso,
				temp: aryTemp[4],
				rain: aryRain[4],
				aqi: aryAir[4]
			}
		];
		console.log(area_items);

		let dateString = basic_f.getCurrentDateTime();
		dateString = dateString.split(' ')[0] + ' ' + dateString.split(' ')[1];	// 濾掉時間
		//let sendMsg = flex_weather.msg('土司天氣預報-2019/11/05', '2019/11/05  06:20am', area_items);
		let sendMsg = flex_weather.msg(s.wea_mmboradcast + dateString.split(' ')[0], dateString, area_items);
		return sendMsg;
	}catch(error){
		fmlog('error_msg', [s.wea_weatherinfo, s.wea_getinfoerr, '-getWeatherString()']);
		console.error(error);
	}		
}

//=================================================
//============= 更新 天氣相關資料 ==================
//=================================================
//功能：將天氣的 flex msg字串發出
//     有三種型式。Reply, P2R, Push

async function _updateWeatherInfoByReply(_event) {
	try {
		let sendMsg = await _getWeatherString();
		_event.reply(sendMsg);
	}catch(error){
		fmlog('error_msg', [s.wea_weatherinfo, s.wea_getinfoerr, '-updateWeatherInfoByReply']);
		console.error(error);
	}
}

async function _updateWeatherInfoByP2R() {
	try{
		let groupDB = usr_mgr.getGDB();
		let sendMsg = await _getWeatherString();
	
		for (let i = 0; i < groupDB.length; i++){
			if (groupDB[i].p2r_sw.weather === true){
				push2reply.add_aP2RMsg_to_aGroup('weather', i, sendMsg);
			}
		}
		push2reply.save(groupDB);
	}catch(error){
		fmlog('error_msg', [s.wea_weatherinfo, s.wea_getinfoerr, '-updateWeatherInfoByP2R']);
		console.error(error);
	}
}

async function _updateWeatherInfoByPush(_bot) {
	try{
		let groupDB = usr_mgr.getGDB();
		let sendMsg = await _getWeatherString();
	
		for (let i = 0; i < groupDB.length; i++){
			if (groupDB[i].p2r_sw.weather === true){
				_bot.push(groupDB[i].gid, sendMsg);
			}
		}
	}catch(error){
		fmlog('error_msg', [s.wea_weatherinfo, s.wea_getinfoerr, '-updateWeatherInfoByPush']);
		console.error(error);
	}
}

//////////////  Module Exports //////////////////
module.exports = {
	updateWeatherInfoByReply : _updateWeatherInfoByReply,
	updateWeatherInfoByP2R : _updateWeatherInfoByP2R,
	updateWeatherInfoByPush : _updateWeatherInfoByPush
};