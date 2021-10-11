'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const crawler_air = require('./crawler_air.js');

//功能：從政府開放資料取得空氣品質 https://data.gov.tw/dataset/40448
async function _getAirInfo() {
	let retVal;
	try {
		const allAirData = await crawler_air.getResults();
		if (!allAirData) throw new Error('AQI info is not correct.');
		const airData = allAirData.filter(item => {
			return (item.name === '中山' || item.name === '新竹' || 
				item.name === '沙鹿' || item.name === '南投' ||
				item.name === '小港'); 
		}).map(item => item.aqi);
		retVal = `${airData[0]}-${airData[1]}-${airData[2]}-${airData[3]}-${airData[4]}`;
	} catch (error) {
		fmlog('error_msg', [s.air_airinfo, s.air_getinfoerr, '']);
		console.error(error);
		retVal = '0-0-0-0-0';
	}
	return retVal;
}

//////////////  Module Exports //////////////////
module.exports = {
	getAirInfo : _getAirInfo
};