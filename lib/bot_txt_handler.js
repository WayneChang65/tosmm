'use strict';
const usr_mgr = require('./usr_mgr.js').init();

const dev_test = require('./dev_test.js');
const su_cmd = require('./su_cmd.js');
const push2reply = require('./push2reply.js');
const custom_cmd = require('./custom_cmd.js').init();
const nlp = require('./nlp.js');
const txt_react = require('./txt_react.js');
const toro = require('./toro.js');
const cmd_ana = require('./cmd_ana.js');
const weather_info = require('./weather_info.js');
const flex_level = require('./flex_level.js');
const levelsys = require('./levelsys.js');

const c = require('./const_def.js').init();

function _bot_txt_handler(_event, _bot) {
	let msg = _event.message.text;
	let cmdCatched = true;

	cmd_ana.do(_event);	// 統計指令

	// [優先權：★★★★★] 測試用指令，如果有處理，就return true
	if (dev_test.do(_event, _bot)) return true;

	// [優先權：★★★★☆] Super User用指令，如果有處理，就return true
	if (su_cmd.do(_event, _bot)) return true;

	// [優先權：★★★★☆] push2reply, 取代push以reply方式回應要公佈的訊息，
	if (push2reply.reply(_event, _bot)) return true;

	// [優先權：★★★★☆] levelsys, 活躍度等級系統
	if (levelsys.do(_event, _bot)) return true;

	// [優先權：★★★☆☆] 客製化指令，如果有處理，就return true
	if (custom_cmd.reply(_event, _bot)) return true;

	// [優先權：★★☆☆☆] AI回應，如果有catch到intent，就return true當成得到指令命令
	if (nlp.talk(_event, _bot)) return true;

	// [優先權：★★☆☆☆] 管理者功能開關檢查，沒檢查過的話，回傳false，就return false當一般對話內容
	if (!usr_mgr.cmdOnOffCheck(_event)) return false;
	
	// [優先權：★☆☆☆☆] 文字回應的指令，所以有文字型的回應都在這函式裏，如果有catch到，回傳true
	if (txt_react.reply(_event, _bot)) return true;

	switch (msg) {
	case '抽美女':
		toro.tg(_event, _bot);
		break;

	case '抽帥哥':
		toro.tb(_event, _bot);
		break;

	case '運勢':
		toro.asa(_event, _bot);
		break;
		
	case '超人運勢':
		toro.sm_asa(_event, _bot);
		break;

	case '抽籤':
		toro.kuzi(_event, _bot);
		break;
	
	case '抽':
		toro.tos_single(_event, _bot, c.CHANCE_NOT_DOUBLE);
		break;

	case '抽超人':
		toro.tsm(_event, _bot);
		break;
		
	case '加倍抽':
		toro.tos_single(_event, _bot, c.CHANCE_DOUBLE);
		break;
	
	case '抽十':
		toro.tos_10(_event, _bot, c.CHANCE_NOT_DOUBLE);
		break;

	case '加倍抽十':
		toro.tos_10(_event, _bot, c.CHANCE_DOUBLE);
		break;

	case '抽好抽滿':
		toro.tos_n(_event, _bot, c.CHANCE_NOT_DOUBLE);
		break;
	
	case '加倍抽好抽滿':
		toro.tos_n(_event, _bot, c.CHANCE_DOUBLE);
		break;
			
	case '開房':
		toro.tf(_event, _bot);
		break;

	case '抽卡機率':
		toro.tchance(_event, _bot, c.TOSMM_TORO_PIC_PATH_TCHANCE);
		break;
	
	case '加倍機率':
		toro.tchanced(_event, _bot, c.TOSMM_TORO_PIC_PATH_TCHANCED);
		break;

	case '群組狀態':
		usr_mgr.getGroupStatus(_event, _bot);
		break;

	case '1:on':	case '1:off':
	case '3:on':	case '3:off':
	case '4:on':	case '4:off':
	case '5:on':	case '5:off':
	case '6:on':	case '6:off':
	case '7:on':	case '7:off':
	case '8:on':	case '8:off':
	case '9:on':	case '9:off':
	case '11:on':	case '11:off':
	case '12:on':	case '12:off':
	case '13:on':	case '13:off':
	case '121:on':	case '121:off':
	case '122:on':	case '122:off':
	case '123:on':	case '123:off':
	case '131:on':	case '131:off':
		usr_mgr.setGroupStatus(_event, _bot);
		break;

	case '小妹請私':
		custom_cmd.reload(_event, _bot);
		break;
	
	case '天氣':	case 'weather':	case '今日天氣':
		weather_info.updateWeatherInfoByReply(_event);
		break;

	default:
		cmdCatched = false;
		break;
	}

	if(cmdCatched) {
		flex_level.retainExp(_event, _bot, c.LV_TOSMM);
	}
	return cmdCatched;
}

/*..........................................................................*/
/*..........................Public Functions................................*/
/*..........................................................................*/

function _go(_event, _bot) {
	return _bot_txt_handler(_event, _bot);
}

//////////////  Module Exports //////////////////
module.exports = {
	go : _go
};