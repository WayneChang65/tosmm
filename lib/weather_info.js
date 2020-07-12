'use strict';
const fs = require('fs');
//const request = require('request');
//const cheerio = require('cheerio');
const basic_f = require('./basic_f.js');
const usr_mgr = require('./usr_mgr.js').init();
const c = require('./const_def.js').init();
const push2reply = require('./push2reply.js');
const fmlog = require('@waynechang65/fml-consolelog').log;
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const flex_weather = require('./flex_weather.js');
const air_info = require('./air_info.js');

// 顯示天氣字串物件
let gWeatherStr = {
	tpi: '',	// 台北
	hsichu: '',	// 新竹
	tch: '',	// 台中
	kso: '',	// 高雄
	nto: ''		// 南投
};

//=================================================
//====== 更新 天氣資料 函式 (台北、台中、高雄)========
//=================================================
// 功能：從中央氣象局抓各城市的天氣預報資料
// 參數：_city，TAIPEI, TAICHUNG, KAOHSIUNG 等int定義常數
//
// 將之前三個函式整合成一個函式來處理很類似的北中高的天氣預報資料更新
function _getWeatherInfo(_city) {
	return new Promise((resolve/*, reject*/) => {
		//let url = '';
		let attr = '';

		switch (_city) {
		case c.TAIPEI:
		//	url = 'http://www.cwb.gov.tw/V7/forecast/taiwan/Taipei_City.htm';
			attr = 'tpi';
			break;
		case c.HSINCHU:
		//	url = 'https://www.cwb.gov.tw/V7/forecast/taiwan/Hsinchu_City.htm';
			attr = 'hsichu';
			break;	
		case c.TAICHUNG:
		//	url = 'https://www.cwb.gov.tw/V7/forecast/taiwan/Taichung_City.htm';
			attr = 'tch';
			break;
		case c.NANTOU:
		//	url = 'https://www.cwb.gov.tw/V7/forecast/taiwan/Nantou_County.htm';
			attr = 'nto';
			break;
		case c.KAOHSIUNG:
		//	url = 'https://www.cwb.gov.tw/V7/forecast/taiwan/Kaohsiung_City.htm';
			attr = 'kso';
			break;	
		
		default:
		}
		// [Mark]因為中央氣象局的網站從 V7 改到 V8，所以爬資料的部分會當掉
		// 先把這部分功能關掉，等後續有時間再來修正。
		/*
		request(url, (err, res, body) => {
			const $ = cheerio.load(body);
			let weathers = [];
			$('#box8 .FcstBoxTable01 tbody tr').each(function(i, elem) {
				weathers.push(
					$(this)
						.text()
						.split('\n')
				);
			});
			weathers = weathers.map(weather => ({
				time: weather[1].substring(2).split(' ')[0],
				temp: weather[2].substring(2),
				rain: weather[6].substring(2),
			}));
			for (let i = 0; i < 1; i++){	// 只顯示今日白天天氣資訊
				gWeatherStr[attr] = weathers[i].temp + '-' + weathers[i].rain;
			}
			console.log(gWeatherStr[attr]);
			if (err){
				console.log('Fail!');
				reject(err);
			}else{	
				console.log('Success!');
				resolve('Success!');
			}
		});
		*/
		// [ADD]因為中央氣象局的網站從 V7 改到 V8，所以爬資料的部分會當掉
		// 先把這部分功能關掉，等後續有時間再來修正。
		for (let i = 0; i < 1; i++){	// 只顯示今日白天天氣資訊
			gWeatherStr[attr] = '? ~ ?' + '-' + '? %';
		}
		console.log('Success!');
		resolve('Success!');
		//
	});
}

//=================================================
//====== 取得 發佈 Line flex message的發送字串 =====
//=================================================
// 功能：取得 Line flex message 發送字串
// 回傳：line flex message string
// 註：取得空氣 AQI 資訊的速度很慢... (官方取得JSON的問題)
async function _getWeatherString() {
	try{
		// 非同步函式，等到台北台中高雄以及空氣資訊依序資料取完後，再reply到群組去。
		await _getWeatherInfo(c.TAIPEI);
		await _getWeatherInfo(c.HSINCHU);
		await _getWeatherInfo(c.TAICHUNG);
		await _getWeatherInfo(c.NANTOU);
		await _getWeatherInfo(c.KAOHSIUNG);
		let air = await air_info.getAirInfo();
		let aryAir = air.split('-');
		let tpi = gWeatherStr['tpi'].split('-');
		let hsichu = gWeatherStr['hsichu'].split('-');
		let tch = gWeatherStr['tch'].split('-');
		let nto = gWeatherStr['nto'].split('-');
		let kso = gWeatherStr['kso'].split('-');

		console.log(air);
		console.log(aryAir);

		// 把 '%' 過濾掉
		tpi[1] = tpi[1].split(' ')[0];
		hsichu[1] = hsichu[1].split(' ')[0];
		tch[1] = tch[1].split(' ')[0];
		nto[1] = nto[1].split(' ')[0];
		kso[1] = kso[1].split(' ')[0];

		let area_items = [
			{
				area: s.wea_tpi,
				temp: tpi[0] + s.wea_degree,
				rain: tpi[1],
				aqi: aryAir[0]
			},
			{
				area: s.wea_hsichu,
				temp: hsichu[0] + s.wea_degree,
				rain: hsichu[1],
				aqi: aryAir[1]
			},
			{
				area: s.wea_tch,
				temp: tch[0] + s.wea_degree,
				rain: tch[1],
				aqi: aryAir[2]
			},
			{
				area: s.wea_nto,
				temp: nto[0] + s.wea_degree,
				rain: nto[1],
				aqi: aryAir[3]
			},
			{
				area: s.wea_kso,
				temp: kso[0] + s.wea_degree,
				rain: kso[1],
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


//===============================================
//========= 每日對各群組 Push 天氣資料 ============
//===============================================
//功能：推送今日天氣預報。
/*
function _pushWeatherMessageToGroups_byGroupDB(_bot){
	// 因為如果設定早上8點以前發訊，必須shift一天，日期才會對。時區問題。
	let dateString = basic_f.getCurrentDateTime(1);
	let groupDB = usr_mgr.getGDB();

	let sendMsg = '\uDBC0\uDC96各位主人早安。\n' + dateString + '\n今日天氣預報。\n\n' +
		gWeatherStr['tpi'] + '\n\n' + gWeatherStr['hsichu'] + '\n\n' +
		gWeatherStr['tch'] + '\n\n' + gWeatherStr['kso'];
	for (let i = 0; i < groupDB.length; i++){
		if (groupDB[i].sw_push_weather === true){
			_bot.push(groupDB[i].gid, sendMsg);
		}
	}
}
*/
/*
function _pushWeatherMessageToGroups_byGroupDB_P2R(){
	// 因為如果設定早上8點以前發訊，必須shift一天，日期才會對。時區問題。
	//let dateString = basic_f.getCurrentDateTime(1);
	let dateString = basic_f.getCurrentDateTime();
	let groupDB = usr_mgr.getGDB();
	
	let sendMsg = '\uDBC0\uDC96各位主人早安。\n' + dateString + '\n今日天氣預報。\n\n' +
		gWeatherStr['tpi'] + gWeatherStr['hsichu'] + '\n\n' +
		gWeatherStr['tch'] + '\n\n' + gWeatherStr['kso'];
	for (let i = 0; i < groupDB.length; i++){
		if (groupDB[i].p2r_sw.weather === true){
			push2reply.add_aP2RMsg_to_aGroup('weather', i, sendMsg);
		}
	}
	push2reply.save(groupDB);
}
*/
//////////////  Module Exports //////////////////
module.exports = {
	updateWeatherInfoByReply : _updateWeatherInfoByReply,
	updateWeatherInfoByP2R : _updateWeatherInfoByP2R,
	updateWeatherInfoByPush : _updateWeatherInfoByPush
};