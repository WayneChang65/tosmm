'use strict';
const cmd_ana = require('./cmd_ana.js');
const air_info = require('./air_info.js');
const usr_mgr = require('./usr_mgr.js').init();
const c = require('./const_def.js').init();
const weather_info = require('./weather_info.js');

function _do(_event, _bot) {
	let msg = _event.message.text;
	let cmdCatched = true;
	let groupDB = usr_mgr.getGDB();

	switch (msg) {
	case '?test1':
		cmd_ana.save();
		break;
	case '?test2':
		air_info.getAirInfo(_event, _bot);
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