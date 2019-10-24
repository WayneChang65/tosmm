'use strict';
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const basic_f = require('./basic_f.js');
const usr_mgr = require('./usr_mgr.js').init();
const c = require('./const_def.js').init();
const push2reply = require('./push2reply.js');
const fmlog = require('@waynechang65/fml-consolelog').log;
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));

// 顯示天氣字串物件
let gWeatherStr = {
	tpi: '',	// 台北
	tch: '',	// 台中
	kso: ''		// 高雄
};

//=================================================
//====== 更新 天氣資料 函式 (台北、台中、高雄)========
//=================================================
// 功能：從中央氣象局抓各城市的天氣預報資料
// 參數：_city，TAIPEI, TAICHUNG, KAOHSIUNG 等int定義常數
//
// 將之前三個函式整合成一個函式來處理很類似的北中高的天氣預報資料更新
function _getWeatherInfo(_city) {
	return new Promise((resolve, reject) => {
		var url = '';
		var consoleStr1 = '';
		var attr = '';
		switch (_city) {
		case c.TAIPEI:
			url = 'http://www.cwb.gov.tw/V7/forecast/taiwan/Taipei_City.htm';
			consoleStr1 = '台北';
			attr = 'tpi';
			break;
		case c.TAICHUNG:
			url = 'https://www.cwb.gov.tw/V7/forecast/taiwan/Taichung_City.htm';
			consoleStr1 = '台中';
			attr = 'tch';
			break;
		case c.KAOHSIUNG:
			url = 'https://www.cwb.gov.tw/V7/forecast/taiwan/Kaohsiung_City.htm';
			consoleStr1 = '高雄';
			attr = 'kso';
			break;
		default:
		}
		request(url, (err, res, body) => {
			const $ = cheerio.load(body);
			let weathers = [];
			$('#box8 .FcstBoxTable01 tbody tr').each(function(/*i, elem*/) {
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
			for (var i = 0; i < 1; i++){	// 只顯示今日白天天氣資訊
				var weatherSign = '';
				var rainPossibility = parseInt(weathers[i].rain.slice(0, 2));
				if (rainPossibility < 30) {
					weatherSign = '\uDBC0\uDCA9';	// sunny
				} else if (rainPossibility >= 30 && rainPossibility < 70){
					weatherSign = '\uDBC0\uDCAC';	// cloudy
				} else {
					weatherSign = '\uDBC0\uDCAA';	// rainny
				}
				//console.log('tpi sign:' + rainPossibility);
				gWeatherStr[attr] = '【' + weatherSign + consoleStr1 + '天氣】\n'
					//+ weathers[i].time + '氣溫 ' + weathers[i].temp + '℃'
					+ '白天氣溫 ' + weathers[i].temp + '℃'
					+ '\n降雨機率 ' + weathers[i].rain;
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
	});
}

//=================================================
//============= 更新 天氣資料 (同步)===============
//=================================================
//功能：從中央氣象局抓台北、台中、高雄氣象資料。
// 中央氣象局都是早上五點更新資料，所以六點抓一次，抓完以後公佈，很OK的了。
// 沒必要沒兩個小時更新一次。
async function _updateWeatherInfoByPush(_bot) {
	try{
		// 非同步函式，等到台北台中高雄依序資料取完後，再push到群組去。
		await _getWeatherInfo(c.TAIPEI);
		await _getWeatherInfo(c.TAICHUNG);
		await _getWeatherInfo(c.KAOHSIUNG);
		_pushWeatherMessageToGroups_byGroupDB(_bot);
	}catch(error){
		fmlog('error_msg', [s.wea_weatherinfo, s.wea_getinfoerr, '-updateWeatherInfoByPush']);
		console.error(error);
	}
}

async function _updateWeatherInfoByReply(_event) {
	try{
		// 非同步函式，等到台北台中高雄依序資料取完後，再reply到群組去。
		await _getWeatherInfo(c.TAIPEI);
		await _getWeatherInfo(c.TAICHUNG);
		await _getWeatherInfo(c.KAOHSIUNG);
		var sendMsg = '\uDBC0\uDC96各位主人好。\n' + '\n今日天氣預報。\n\n' +
			gWeatherStr['tpi'] + '\n\n' + gWeatherStr['tch'] + '\n\n' + gWeatherStr['kso'];
		_event.reply(sendMsg);
	}catch(error){
		fmlog('error_msg', [s.wea_weatherinfo, s.wea_getinfoerr, '-updateWeatherInfoByReply']);
		console.error(error);
	}	
}

async function _updateWeatherInfoByP2R(/*_event*/) {
	try{
		// 非同步函式，等到台北台中高雄依序資料取完後，再push到群組去。
		await _getWeatherInfo(c.TAIPEI);
		await _getWeatherInfo(c.TAICHUNG);
		await _getWeatherInfo(c.KAOHSIUNG);
		_pushWeatherMessageToGroups_byGroupDB_P2R();
	}catch(error){
		fmlog('error_msg', [s.wea_weatherinfo, s.wea_getinfoerr, '-updateWeatherInfoByP2R']);
		console.error(error);
	}
}

//===============================================
//========= 每日對各群組 Push 天氣資料 ============
//===============================================
//功能：推送今日天氣預報。
function _pushWeatherMessageToGroups_byGroupDB(_bot){
	// 因為如果設定早上8點以前發訊，必須shift一天，日期才會對。時區問題。
	let dateString = basic_f.getCurrentDateTime(1);
	let groupDB = usr_mgr.getGDB();

	let sendMsg = '\uDBC0\uDC96各位主人早安。\n' + dateString + '\n今日天氣預報。\n\n' +
		gWeatherStr['tpi'] + '\n\n' + gWeatherStr['tch'] + '\n\n' + gWeatherStr['kso'];
	for (let i = 0; i < groupDB.length; i++){
		if (groupDB[i].sw_push_weather === true){
			_bot.push(groupDB[i].gid, sendMsg);
		}
	}
}

function _pushWeatherMessageToGroups_byGroupDB_P2R(){
	// 因為如果設定早上8點以前發訊，必須shift一天，日期才會對。時區問題。
	//let dateString = basic_f.getCurrentDateTime(1);
	let dateString = basic_f.getCurrentDateTime();
	let groupDB = usr_mgr.getGDB();
	
	let sendMsg = '\uDBC0\uDC96各位主人早安。\n' + dateString + '\n今日天氣預報。\n\n' +
		gWeatherStr['tpi'] + '\n\n' + gWeatherStr['tch'] + '\n\n' + gWeatherStr['kso'];
	for (let i = 0; i < groupDB.length; i++){
		if (groupDB[i].p2r_sw.weather === true){
			push2reply.add_aP2RMsg_to_aGroup('weather', i, sendMsg);
		}
	}
	push2reply.save(groupDB);
}

//////////////  Module Exports //////////////////
module.exports = {
	updateWeatherInfoByReply : _updateWeatherInfoByReply,
	updateWeatherInfoByP2R : _updateWeatherInfoByP2R,
	updateWeatherInfoByPush : _updateWeatherInfoByPush
};