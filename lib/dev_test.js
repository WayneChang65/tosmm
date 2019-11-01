'use strict';
const cmd_ana = require('./cmd_ana.js');
const air_info = require('./air_info.js');
const usr_mgr = require('./usr_mgr.js').init();
const c = require('./const_def.js').init();
const weather_info = require('./weather_info.js');
const flex_weather = require('./flex_weather.js');

function _do(_event, _bot) {
	let msg = _event.message.text;
	let cmdCatched = true;
	let groupDB = usr_mgr.getGDB();

	let temp;
	switch (msg) {
	case '?test1':
		cmd_ana.save();
		break;
	case '?test2':
		//air_info.getAirInfo(_event, _bot);
		break;
	case '?test3':
		_bot.push(groupDB[c.GIDX_WTESTFIRE].gid, 'test push');	// 小妹測試空間-火妍
		break;
	case '?test11':
		weather_info.updateWeatherInfoByReply(_event);
		break;
	case '?test12':
		weather_info.updateWeatherInfoByP2R();
		break;
	case '?test21':
		console.log(c);
		break;
	case '?test555':
		let area_items = [
			{
				area: '台北',
				temp: '27 ℃ ~ 31 ℃',
				rain: '0',
				aqi: '30'
			},
			{
				area: '新竹',
				temp: '21 ℃ ~ 30 ℃',
				rain: '100',
				aqi: '80'
			},
			{
				area: '台中',
				temp: '20 ℃ ~ 23 ℃',
				rain: '50',
				aqi: '120'
			},
			{
				area: '高雄',
				temp: '21 ℃ ~ 30 ℃',
				rain: '100',
				aqi: '170'
			}
		];
		temp = flex_weather.msg('土司天氣預報-2019/11/05', '2019/11/05  06:20am', area_items);
		_event.reply(temp);
		console.log(temp);
		break;				
	default:
		cmdCatched = false;
		break;
	}
	return cmdCatched;
}

//////////////  Module Exports //////////////////
module.exports = {
	do : _do
};