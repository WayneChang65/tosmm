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

// 五站顯示名稱，對應 air_info.js 的五測站(中山/新竹/沙鹿/南投/小港)
const AREAS = [s.wea_tpi, s.wea_hsichu, s.wea_tch, s.wea_nto, s.wea_kso];

// ===== bot-api 資料不可用(離線/壞資料)時的 placeholder =====
const FALLBACK_AQI = ['0', '0', '0', '0', '0'];
const FALLBACK_TEMP = ['? ~ ? ℃', '? ~ ? ℃', '? ~ ? ℃', '? ~ ? ℃', '? ~ ? ℃'];
const FALLBACK_RH = ['? %', '? %', '? %', '? %', '? %'];

// 功能：解析 air_info.getAirInfo() 的回傳字串
// 格式：AQI(五站，'-'分隔) + '#' + 溫溼度(五站，'-'分隔，每站「溫度#濕度」)
// 回傳：{ aryAqi, aryTemp, aryRh }，任一站資料缺漏則throw
function _parseAirInfo(str_air_info) {
	const idxHash = str_air_info.indexOf('#');
	if (idxHash === -1) throw new Error('AIR info format is not correct.');

	const aryAqi = str_air_info.substring(0, idxHash).split('-');
	const aryTemp = [], aryRh = [];
	for (const item of str_air_info.substring(idxHash + 1).split('-')) {
		const pair = item.split('#');
		aryTemp.push(pair[0]);
		aryRh.push(pair[1]);
	}

	const isBad = (v) => (v == null) || (v === '');
	if (aryAqi.length !== 5 || aryTemp.length !== 5 || aryRh.length !== 5 ||
		aryAqi.some(isBad) || aryTemp.some(isBad) || aryRh.some(isBad)) {
		throw new Error('AIR info is incomplete.');
	}
	return { aryAqi, aryTemp, aryRh };
}

// 功能：組五站的天氣資料項目(供 flex_weather 使用)
// 註：flex_weather 的 rain 欄位現為「濕度」顯示(降雨機率來源CWB預報API已下線)
function _getAreaItems(aryAqi, aryTemp, aryRh) {
	return AREAS.map((area, i) => {
		return {
			area: area,
			temp: aryTemp[i],
			rain: aryRh[i],
			aqi: aryAqi[i]
		};
	});
}

//=================================================
//====== 取得 發佈 Line flex message的發送字串 =====
//=================================================
// 功能：取得 Line flex message 發送字串
// 回傳：line flex message string
async function _getWeatherString() {
	let str_air_info = await air_info.getAirInfo();

	// air_info 內部已處理取得失敗(回傳全0/全問號字串)；此處再防一層格式異常
	let aryAqi, aryTemp, aryRh;
	try {
		const parsed = _parseAirInfo(str_air_info);
		aryAqi = parsed.aryAqi;
		aryTemp = parsed.aryTemp;
		aryRh = parsed.aryRh;
	} catch (error) {
		fmlog('error_msg', [s.wea_weatherinfo, s.wea_getinfoerr, '-parseAirInfo()']);
		console.error(error);
		aryAqi = FALLBACK_AQI;
		aryTemp = FALLBACK_TEMP;
		aryRh = FALLBACK_RH;
	}

	let area_items = _getAreaItems(aryAqi, aryTemp, aryRh);
	console.log(area_items);

	let dateString = basic_f.getCurrentDateTime();
	dateString = dateString.split(' ')[0] + ' ' + dateString.split(' ')[1];	// 濾掉時間
	let sendMsg = flex_weather.msg(s.wea_mmboradcast + dateString.split(' ')[0], dateString, area_items);
	return sendMsg;
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
			if (groupDB[i].is_alive === true && groupDB[i].p2r_sw.weather === true){
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
			if (groupDB[i].is_alive === true && groupDB[i].p2r_sw.weather === true){
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
