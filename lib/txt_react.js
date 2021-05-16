'use strict';
const usr_mgr = require('./usr_mgr.js').init();
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const crawler_handler = require('./crawler_handler.js');
const flex_gcmd = require('./flex_gcmd.js');

function _txtReply(_event, _bot) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);
	
	let cmdCatched = true;
	let msgR, msgR_cli;

	switch (msg.split(' ')[0]) {
	case '瓶中信':
		if (msg.split(' ')[1]) {
			msgR = '\u{1F4E9} ' + s.tr_reportreact;
			msgR_cli = '【RP】';
		}else{
			msgR = s.tr_reportexample;
			msgR_cli = s.tr_reportuncomplete;
		}
		break;

	case '小妹指令':
		msgR = msgR_cli = s.tr_mmcmd + s.tr_cmdlink;
		break;
	
	case '土司小妹':
		msgR = msgR_cli = s.tr_mm + s.tr_mmlink;
		break;
	
	case '群組指令':
		// 如果有 Flex msg, msgR跟 msgR_cli不一樣。因為msgR_cli是要格式化顯示在cli上的。
		msgR_cli = s.tr_gcmd + s.tr_cmdlink;
		msgR = flex_gcmd.msg();
		break;

	case 'ptt': 	case 'PTT': 	case 'Ptt':
		msgR = msgR_cli = crawler_handler.getCrawlerData('ptt');
		break;

	case '巴哈':	case 'baha': 	case 'BAHA': 	case 'Baha':
		msgR = msgR_cli = crawler_handler.getCrawlerData('baha');
		break;

	case 'tos': 	case 'TOS': 	case 'Tos':
		msgR = msgR_cli = crawler_handler.getCrawlerData('tos');
		break;

	case 'g8g': 	case 'G8G': 	case 'G8g':
		msgR = msgR_cli = crawler_handler.getCrawlerData('g8g');
		break;	
	
	case '本週活動': 	case 'week': 	case 'WEEK': 	case 'Week':
		try {
			msgR = msgR_cli = crawler_handler.getCrawlerObj().tos.weeks;
		} catch(err) {
			msgR = msgR_cli = '';
		}
		break;
	default:
		cmdCatched = false;
		break;
	}
	if (cmdCatched) {
		_bot.getGroupMemberProfile(gID, uID).then((profile) => {
			_event.reply(msgR)
				.then(() => {
					// 如果是陣列，就用0號陣列資料做console out
					if (typeof(msgR_cli) === 'object') msgR_cli = msgR_cli[0];
					msgR_cli = msgR_cli.split('\n')[0];
					fmlog('command_msg',
						['GN:' + groupDB[idx].gname, idx, msg,
							msgR_cli.slice(0,18) + '...', profile.displayName, uID]);
				});
		});
	}
	return cmdCatched;
}

//////////////  Module Exports //////////////////
module.exports = {
	reply : _txtReply
};