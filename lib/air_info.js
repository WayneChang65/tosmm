'use strict';
const request = require('request');
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));

//功能：從政府開放資料取得空氣品質 https://data.gov.tw/dataset/40448
function _getAirInfo() {
	return new Promise((resolve/*, reject*/) => {
		let url = 'http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$orderby=SiteName&$skip=0&$top=1000&format=json';
		request(url, (err, res, body) => {
			try {
				let air_db = JSON.parse(body);
				// 因為Open data的位置有可能會變，所以確認SiteId。
				// 不過這個方式不是很好，未來有機會再改善。
				if (air_db[10].SiteId !== '12' ||
					air_db[57].SiteId !== '24' ||
					air_db[25].SiteId !== '29' ||
					air_db[36].SiteId !== '36' ||
					air_db[9].SiteId !== '58'
				) throw new Error('AQI info is not correct.');
				
				let retVal = 
					air_db[10].AQI + '-' +	// 台北市-中山 
					air_db[57].AQI + '-' +	// 新竹市-新竹 
					air_db[25].AQI + '-' +	// 台中市-沙鹿
					air_db[36].AQI + '-' +	// 南投縣-南投
					air_db[9].AQI;			// 高雄縣-小港
				resolve(retVal);
			}catch(error){
				fmlog('error_msg', [s.air_airinfo, s.air_getinfoerr, '']);
				console.error(error);
				let retVal = '0-0-0-0-0';
				resolve(retVal);
				//throw error;
			}
		});
	});
}

//////////////  Module Exports //////////////////
module.exports = {
	getAirInfo : _getAirInfo
};