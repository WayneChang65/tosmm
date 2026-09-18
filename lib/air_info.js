'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const crawler_air = require('./crawler_air.js');

// 五個測站，依序對應：台北(中山)、新竹、台中(沙鹿)、南投、高雄(小港)
const SITES = ['中山', '新竹', '沙鹿', '南投', '小港'];

// 功能：從 bot-api 回傳的單站資料取有效數值(單值 或 min/max 或 array)
// 回傳：{ min, max } 或 null
function _range(value, valueMin, valueMax) {
	const nums = [];
	const push = (v) => {
		const n = (typeof v === 'string') ? parseFloat(v) : v;
		if (typeof n === 'number' && !isNaN(n)) nums.push(n);
	};
	if (Array.isArray(value)) value.forEach(push);
	else push(value);
	push(valueMin);
	push(valueMax);
	if (nums.length === 0) return null;
	return { min: Math.min(...nums), max: Math.max(...nums) };
}

// 功能：取單值(陣列時取最後一個有效值)
function _latestValue(value, valueMin, valueMax) {
	const r = _range(value, valueMin, valueMax);
	if (r == null) return null;
	if (Array.isArray(value)) {
		for (let i = value.length - 1; i >= 0; i--) {
			const n = (typeof value[i] === 'string') ? parseFloat(value[i]) : value[i];
			if (typeof n === 'number' && !isNaN(n)) return n;
		}
	}
	return r.max;
}

// 功能：組合氣溫顯示字串，例：'24.8 ~ 31.1 ℃'；單值時 '24.8 ~ 24.8 ℃'
function _tempRangeString(item) {
	const r = _range(item.temperature, item.temperatureMin, item.temperatureMax);
	if (r == null) return '? ~ ? ℃';
	return r.min + ' ~ ' + r.max + ' ℃';
}

//功能：從政府開放資料取得空氣品質 https://data.gov.tw/dataset/40448
//      bot-api 同資料源亦提供各測站的當日至現在氣溫(氣溫)、濕度(RH)，一併取回。
//回傳：以 '#' 分隔的兩段字串：
//      第一段為AQI(以 '-' 分隔五站)、第二段為溫溼度(以 '-' 分隔五站，每站為「最低溫 ~ 最高溫 ℃#濕度%」)
async function _getAirInfo() {
	let retVal;
	try {
		const allAirData = await crawler_air.getResults();
		if (!allAirData) throw new Error('AQI info is not correct.');

		const siteData = SITES.map((site) => {
			const item = allAirData.find(d => d.name === site);
			if (!item) throw new Error('AIR info is not correct. (no site ' + site + ')');
			return item;
		});

		const aryAqi = siteData.map(item => (item.aqi != null && item.aqi !== '') ? item.aqi : 0);
		const aryTempHum = siteData.map(item => {
			const tempStr = _tempRangeString(item);
			const hum = _latestValue(item.humidity, item.humidityMin, item.humidityMax);
			const humStr = (hum != null) ? hum + ' %' : '? %';
			return tempStr + '#' + humStr;
		});

		retVal = aryAqi.join('-') + '#' + aryTempHum.join('-');
	} catch (error) {
		fmlog('error_msg', [s.air_airinfo, s.air_getinfoerr, '']);
		console.error(error);
		//AQI五站皆以0代替，溫溼度五站皆以問號代替
		retVal = '0-0-0-0-0#? ~ ? ℃#? %-? ~ ? ℃#? %-? ~ ? ℃#? %-? ~ ? ℃#? %-? ~ ? ℃#? %';
	}
	return retVal;
}

//////////////  Module Exports //////////////////
module.exports = {
	getAirInfo : _getAirInfo
};