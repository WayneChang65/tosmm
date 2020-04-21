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
				let idx_taipei, idx_hsinchu, idx_taichung, idx_nantou, idx_kaohsiung;

				idx_taipei = air_db.map(function(item/*, index, array*/) {
					return item.SiteId;
				}).indexOf('12');

				idx_hsinchu = air_db.map(function(item/*, index, array*/) {
					return item.SiteId;
				}).indexOf('24');

				idx_taichung = air_db.map(function(item/*, index, array*/) {
					return item.SiteId;
				}).indexOf('29');

				idx_nantou = air_db.map(function(item/*, index, array*/) {
					return item.SiteId;
				}).indexOf('36');
				
				idx_kaohsiung = air_db.map(function(item/*, index, array*/) {
					return item.SiteId;
				}).indexOf('58');

				if (idx_taipei && idx_hsinchu && idx_taichung && idx_nantou && idx_kaohsiung) {
					if(!air_db[idx_taipei].AQI) air_db[idx_taipei].AQI = '0';
					if(!air_db[idx_hsinchu].AQI) air_db[idx_hsinchu].AQI = '0';
					if(!air_db[idx_taichung].AQI) air_db[idx_taichung].AQI = '0';
					if(!air_db[idx_nantou].AQI) air_db[idx_nantou].AQI = '0';
					if(!air_db[idx_kaohsiung].AQI) air_db[idx_kaohsiung].AQI = '0';

					let retVal = 
						air_db[idx_taipei].AQI + '-' +		// 台北市-中山 
						air_db[idx_hsinchu].AQI + '-' +		// 新竹市-新竹 
						air_db[idx_taichung].AQI + '-' +	// 台中市-沙鹿
						air_db[idx_nantou].AQI + '-' +		// 南投縣-南投
						air_db[idx_kaohsiung].AQI;			// 高雄縣-小港
					resolve(retVal);
				}else{
					throw new Error('AQI info is not correct.');
				}
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