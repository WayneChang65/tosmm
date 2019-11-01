'use strict';
const request = require('request');
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));

//功能：從政府開放資料取得空氣品質 https://data.gov.tw/dataset/40448
function _getAirInfo() {
	return new Promise((resolve, reject) => {
		let url = 'http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=1000&format=json';
		request(url, (err, res, body) => {
			try {
				let air_db = JSON.parse(body);
				let retVal = air_db[70].AQI + '-' + air_db[61].AQI + '-' + 
					air_db[56].AQI + '-' + air_db[31].AQI;
				resolve(retVal);
			}catch(error){
				fmlog('error_msg', [s.air_airinfo, s.air_getinfoerr, '']);
				console.error(error);
				throw error;
			}
		});
	});
}

//////////////  Module Exports //////////////////
module.exports = {
	getAirInfo : _getAirInfo
};