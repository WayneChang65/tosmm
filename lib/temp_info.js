'use strict';
const request = require('request');
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const c = require('./const_def.js').init();

function _getTempString(_location_time_array) {
	let aryTemp = [];
	const AVERAGE_TERMS = 5; // 因為預報每3小時一次，基本上15小時5筆來算溫差範圍，應該是夠了。
	for (let i = 0; i < AVERAGE_TERMS; i++) {
		aryTemp.push(parseInt(_location_time_array[i].elementValue.value));
	}
	aryTemp.sort(function (a, b) {
		return a - b;
	});

	return aryTemp[0] + ' ~ ' + aryTemp[aryTemp.length - 1] + ' ℃';
}

function _getRainString(_local_rain_array) {
	let aryRain = [];
	const AVERAGE_TERMS = 1; // 因為預報每12小時一次，基本上直接取1項值引用即可。
	
	for (let i = 0; i < AVERAGE_TERMS; i++) {
		aryRain.push(parseInt(_local_rain_array[i].elementValue.value));
	}
	return aryRain[0];
}

// 功能：從政府開放資料取得空氣品質 
// https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/
function _getTempInfo() {
	return new Promise((resolve/*, reject*/) => {
		let url = 'https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-D0047-089?Authorization=' +
			c.TOSMM_OPENDATA_TOKEN + '&format=json';
		request(url, (err, res, body) => {
			try {
				let temp_db = JSON.parse(body).cwbopendata.dataset.locations.location;
				let idx_taipei, idx_hsinchu, idx_taichung, idx_nantou, idx_kaohsiung;

				idx_taipei = temp_db.map(function(item/*, index, array*/) {
					return item.locationName;
				}).indexOf('臺北市');

				idx_hsinchu = temp_db.map(function(item/*, index, array*/) {
					return item.locationName;
				}).indexOf('新竹市');

				idx_taichung = temp_db.map(function(item/*, index, array*/) {
					return item.locationName;
				}).indexOf('臺中市');

				idx_nantou = temp_db.map(function(item/*, index, array*/) {
					return item.locationName;
				}).indexOf('南投縣');
				
				idx_kaohsiung = temp_db.map(function(item/*, index, array*/) {
					return item.locationName;
				}).indexOf('高雄市');

				let retVal = {};
				if (idx_taipei && idx_hsinchu && idx_taichung && idx_nantou && idx_kaohsiung) {
					retVal.temp = 
						_getTempString(temp_db[idx_taipei].weatherElement[0].time) + '-' +
						_getTempString(temp_db[idx_hsinchu].weatherElement[0].time) + '-' +
						_getTempString(temp_db[idx_taichung].weatherElement[0].time) + '-' +
						_getTempString(temp_db[idx_nantou].weatherElement[0].time) + '-' +
						_getTempString(temp_db[idx_kaohsiung].weatherElement[0].time);

					retVal.rain = 
						_getRainString(temp_db[idx_taipei].weatherElement[4].time) + '-' +
						_getRainString(temp_db[idx_hsinchu].weatherElement[4].time) + '-' +
						_getRainString(temp_db[idx_taichung].weatherElement[4].time) + '-' +
						_getRainString(temp_db[idx_nantou].weatherElement[4].time) + '-' +
						_getRainString(temp_db[idx_kaohsiung].weatherElement[4].time);
					resolve(retVal);
				}else{
					throw new Error('TEMP info is not correct.');
				}
				
			}catch(error){
				fmlog('error_msg', [s.temp_tempinfo, s.temp_getinfoerr, '']);
				console.error(error);
				let retVal = {};
				retVal.temp = '? ~ ? ℃-? ~ ? ℃-? ~ ? ℃-? ~ ? ℃-? ~ ? ℃';
				retVal.rain = '?-?-?-?-?';
				resolve(retVal);
			}
		});
	});
}
//////////////  Module Exports //////////////////
module.exports = {
	getTempInfo : _getTempInfo
};