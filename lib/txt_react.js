'use strict';
const usr_mgr = require('./usr_mgr.js').init();
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const crawler_handler = require('./crawler_handler.js');

function _txtReply(_event, _bot) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);
	
	let cmdCatched = true;
	let msgR;

	switch (msg) {
	case '小妹指令':		
		msgR = s.tr_mmcmd + s.tr_cmdlink;
		break;
	
	case '土司小妹':
		msgR = s.tr_mm + s.tr_mmlink;
		break;
	
	case '群組指令':
		msgR = s.tr_gcmd + s.tr_cmdlink;
		break;

	case 'ptt': 	case 'PTT': 	case 'Ptt':
		msgR = crawler_handler.getCrawlerData('ptt');
		break;

	case 'baha': 	case 'BAHA': 	case 'Baha':
		msgR = crawler_handler.getCrawlerData('baha');
		break;

	case 'tos': 	case 'TOS': 	case 'Tos':
		msgR = crawler_handler.getCrawlerData('tos');
		break;

	case 'g8g': 	case 'G8G': 	case 'G8g':
		msgR = crawler_handler.getCrawlerData('g8g');
		break;	
	
	case '本週活動': 	case 'week': 	case 'WEEK': 	case 'Week':
		try {
			msgR  = crawler_handler.getCrawlerObj().tos.weeks;
		} catch(err) {
			msgR = '';
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
					if (typeof(msgR) === 'object') msgR = msgR[0];
					msgR = msgR.split('\n')[0];
					fmlog('command_msg',
						['GN:' + groupDB[idx].gname, idx, msg,
							msgR.slice(0,18) + '...', profile.displayName, uID]);
				});
		});
	}
	return cmdCatched;
}

//////////////  Module Exports //////////////////
module.exports = {
	reply : _txtReply
};