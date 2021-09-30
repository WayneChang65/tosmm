'use strict';

const express = require('express');
const linebot = require('@waynechang65/linebot');
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const c = require('./const_def.js').init();

const bot_txt_handler = require('./bot_txt_handler.js');
const bot_img_handler = require('./bot_img_handler.js');
const bot_video_handler = require('./bot_video_handler.js');
const bot_audio_handler = require('./bot_audio_handler.js');
const bot_location_handler = require('./bot_location_handler.js');
const bot_sticker_handler = require('./bot_sticker_handler.js');

const crawler_handler = require('./crawler_handler.js');

const usr_mgr = require('./usr_mgr.js').init();
const custom_cmd = require('./custom_cmd.js');
const cmd_ana = require('./cmd_ana.js');

const scheduling = require('./scheduling.js');
const weather_info = require('./weather_info.js');
const flex_level = require('./flex_level.js');

const to_webapi = require('./to_webapi.js');
const tosmm_skip = require('./tosmm_skip.js');

/*..........................................................................*/
/*..........................................................................*/
/*..........................程 式 執 行 區...................................*/
/*..........................................................................*/
/*..........................................................................*/
let bot, port;
process.stdin.resume();

switch (process.argv[2]) {
case 'water':
	port = c.PORT_WATER;
	bot = linebot({
		channelId: c.CHANNEL_ID_WATER,
		channelSecret: c.CHANNEL_SECRET_WATER,
		channelAccessToken: c.CHANNEL_ACCESS_TOKEN_WATER
	});
	fmlog('basic_msg', s.idx_fire);
	break;

// For TEST (The server is call TOSMM-FIRE)
default:
	port = c.PORT_FIRE;
	bot = linebot({
		channelId: c.CHANNEL_ID_FIRE,
		channelSecret: c.CHANNEL_SECRET_FIRE,
		channelAccessToken: c.CHANNEL_ACCESS_TOKEN_FIRE
	});
	fmlog('basic_msg', s.idx_water);
	break;
}

const linebotParser = bot.parser();
const app = express();
app.post('/webhook', linebotParser);

let server = app.listen(port, function() {
	fmlog('sys_msg', [s.idx_tosmm, s.idx_running + String(server.address().port)]);
});

// 爬蟲 開始
crawler_handler.go(undefined, bot);

// UserDB 排序完後存檔
flex_level.rankSort().save();

// 開放資料 傳到 WEB API Server
to_webapi.go();

/*..........................................................................*/
/*..........................定 時 每 天 執 行................................*/
/*..........................................................................*/
// 非必要資料存檔 (指令統計、抽卡統計...)
scheduling.setCyclicTimer_Do_Everyday(undefined, bot, _saveDBs, 
	'02:05', c.TOMORROW, s.tosmm_sysdbsave, s.tosmm_sysdbsave_msg);

// 天氣資訊
scheduling.setCyclicTimer_Do_Everyday(undefined, bot, weather_info.updateWeatherInfoByP2R, 
	'06:10', c.TOMORROW, s.tosmm_weather, s.tosmm_weather_msg);

// Google Spreadsheet客製化指令更新 (每天自動 小妹請私)
scheduling.setCyclicTimer_Do_Everyday(undefined, bot, custom_cmd.reload, 
	'02:10', c.TOMORROW, s.tosmm_customcmd, s.tosmm_customcmd_msg);

/*..........................................................................*/
/*..........................................................................*/
/*..........................事 件 處 理 區...................................*/
/*..........................................................................*/
/*..........................................................................*/

// 個人加入機器人為成為好友時，會被觸發
bot.on('follow', function (_event) {
	let uID = _event.source.userId;
	_event.reply(s.idx_invalid);
	fmlog('event_msg', [s.idx_follow, s.idx_add , uID]);
});

// 機器人被加入到某個Room / Group時，會被觸發
bot.on('join', function (_event) {
	if (tosmm_skip.check(_event)) return;

	let gID = _event.source.groupId;
	let rID = _event.source.roomId;
	if(gID){
		_event.reply('\u{2757}' + '\u{2757}' + '\u{2757}' + s.idx_atten + '\u{2757}' + '\u{2757}' + '\u{2757}'
			+ '\n' + s.idx_copyright + '\n\n' + s.idx_mmcmd +
			decodeURIComponent('https://ppt.cc/fALMzx'));
		fmlog('event_msg', [s.idx_ejoin, s.idx_gfollow, gID]); 
	}else{
		_event.reply(s.idx_invalid);
		fmlog('event_msg', [s.idx_ejoin, s.idx_rfollow, rID]);
	}
});

// 機器人被退出某個 Group/Room 被觸發
bot.on('leave', function (_event) {
	if (tosmm_skip.check(_event)) return;

	let gID = _event.source.groupId;
	let rID = _event.source.roomId;
	if(gID){
		try {
			let idx = usr_mgr.getGIDX(gID);
			let groupDB = usr_mgr.getGDB();
			let gName = (Object.prototype.hasOwnProperty.call(groupDB[idx], 'gname'))
				? (groupDB[idx].gname) : '';
			groupDB[idx].is_alive = false;
			usr_mgr.saveGDB(groupDB);
			fmlog('event_msg', [s.idx_eleft, s.idx_rleft, gName]);
		} catch (e) {
			console.log(e);
		}
	}else{
		fmlog('event_msg', [s.idx_eleft, s.idx_gleft, rID]);
	}
});

// 機器人所在的群組有新成員加入時，會被觸發
bot.on('memberJoined', function (_event) {
	if (tosmm_skip.check(_event)) return;

	let gID = _event.source.groupId;
	_event.source.profile().then(function (_profile) {
		if(_event.source.type === 'group') {
			let replyMsg_normal = _profile.displayName + s.idx_welcome;
			_event.reply(replyMsg_normal);
			fmlog('event_msg', [s.idx_mjoined, _profile.displayName + s.idx_join +
				gID + s.idx_group, _event.joined.members[0].userId]);
		}
	});
});

// 機器人所在的群組有成員離開，會被觸發
bot.on('memberLeft', function (_event) {
	// 這個事件，並沒有reply token，所以無法在這個訊息進行reply
	fmlog('event_msg', [s.idx_mleft, _event.source.groupId +
		s.idx_mgleft, _event.left.members[0].userId]);
});

// 功能：linebot 主要訊息處理函式
// 加機器人的個人/Room/Group「送訊息時」，通通會觸發
bot.on('message', async function(_event) {
	if (tosmm_skip.check(_event)) return;

	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let msg = _event.message.text;
	let msgType = _event.message.type;

	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);

	// 如果不是從群組發送訊息來的話，直接 return
	// 因為這個機器人被設定只能在群組中作用(個人/Room都無法作用)
	if (!gID){
		_event.reply(s.idx_invalid);
		fmlog('event_msg', [s.idx_notingroup, msg, uID]);
		return;
	}
	let ret_setGrouMgr, ret_maintainUDB, ret_maintainGDB;
	let ret_bot_txt_handler, ret_bot_image_handler, ret_bot_sticker_handler;
	let ret_bot_video_handler, ret_bot_audio_handler, ret_bot_location_handler;

	switch (msgType) {
	case 'text':
		// fmlog(特定console out)的訊息，基本上如果 handler有攔到，就內部去發，
		// 否則如果沒攔到，就最外部當一般chat來console out。
		try {
			ret_setGrouMgr =  await usr_mgr.setGroupMgr(_event);	// 群組管理、群組資訊設定
			ret_maintainUDB = await usr_mgr.maintainUDB(_event);	// 記錄使用者 UID 與 GID
			ret_maintainGDB = await usr_mgr.maintainGDB(_event);	// 使用者DB物件 管理
			ret_bot_txt_handler = bot_txt_handler.go(_event, bot);	// txt指令處理
		} catch(err) {
			console.log(err);
			throw err;
		}

		if (!(ret_setGrouMgr !== null) &&
			!ret_maintainUDB &&
			!ret_maintainGDB &&
			!ret_bot_txt_handler
		) {
			bot.getGroupMemberProfile(gID, uID).then((profile) => {
				fmlog('basic_chat',
					['GN:' + groupDB[idx].gname, idx, msg, 'Talking' , profile.displayName, uID + '\n']);
				flex_level.retainExp(_event, bot, c.LV_SPEAKING);
			});
		}
		break;
	
	case 'image':
		try {
			ret_bot_image_handler = bot_img_handler.go(_event, bot);
		} catch (err) {
			console.log(err);
			throw err;
		}
		if (!ret_bot_image_handler) {
			bot.getGroupMemberProfile(gID, uID).then((profile) => {
				fmlog('basic_chat',
					['GN:' + groupDB[idx].gname, idx, '.............', 'Image' , profile.displayName, uID]);
				flex_level.retainExp(_event, bot, c.LV_PIC);	
			});
		}
		break;

	case 'video':
		try {
			ret_bot_video_handler = bot_video_handler.go(_event, bot);
		} catch (err) {
			console.log(err);
			throw err;
		}
		if (!ret_bot_video_handler) {
			bot.getGroupMemberProfile(gID, uID).then((profile) => {
				fmlog('basic_chat',
					['GN:' + groupDB[idx].gname, idx, '.............', 'Video' , profile.displayName, uID]);
				flex_level.retainExp(_event, bot, c.LV_PIC);	
			});
		}
		break;

	case 'audio':
		try {
			ret_bot_audio_handler = bot_audio_handler.go(_event, bot);
		} catch (err) {
			console.log(err);
			throw err;
		}
		if (!ret_bot_audio_handler) {
			bot.getGroupMemberProfile(gID, uID).then((profile) => {
				fmlog('basic_chat',
					['GN:' + groupDB[idx].gname, idx, '.............', 'Audio' , profile.displayName, uID]);
				flex_level.retainExp(_event, bot, c.LV_PIC);
			});
		}
		break;
	
	case 'location':
		try {
			ret_bot_location_handler = bot_location_handler.go(_event, bot);
		} catch (err) {
			console.log(err);
			throw err;
		}
		if (!ret_bot_location_handler) {
			bot.getGroupMemberProfile(gID, uID).then((profile) => {
				fmlog('basic_chat',
					['GN:' + groupDB[idx].gname, idx, '.............', 'Location' , profile.displayName, uID]);
				flex_level.retainExp(_event, bot, c.LV_PIC);
			});
		}
		break;

	case 'sticker':
		try {
			ret_bot_sticker_handler = bot_sticker_handler.go(_event, bot);
		} catch (err) {
			console.log(err);
			throw err;
		}
		if (!ret_bot_sticker_handler) {
			bot.getGroupMemberProfile(gID, uID).then((profile) => {
				fmlog('basic_chat',
					['GN:' + groupDB[idx].gname, idx, '.............', 'Sticker' , profile.displayName, uID]);
				flex_level.retainExp(_event, bot, c.LV_SPEAKING);	
			});
		}
		break;

	default:
		break;
	}
});

/*..........................................................................*/
/*..........................................................................*/
/*..........................區 域 函 式 區...................................*/
/*..........................................................................*/
/*..........................................................................*/

function _saveDBs() {
	cmd_ana.save();
	flex_level.rankSort().save();
}