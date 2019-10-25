'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
//const dateTime = require('node-datetime');
const usr_mgr = require('./usr_mgr.js').init();
const push2reply = require('./push2reply.js');
const basic_f = require('./basic_f.js');
const c = require('./const_def.js').init();
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const toro_db = require('../json/toro_db.json');

// 目前設定 小妹測試空間(火妍)
// Super User Group ID
let SU_GIDX =  c.TOSMM_SU_GIDX;

// 本程式開始執行的時間
let m_DateTime = basic_f.getCurrentDateTime();

/*
let gDt = dateTime.create();
if (basic_f.isDST()) {
	gDt.offsetInHours(9);
}else{
	gDt.offsetInHours(8);
}
dateTime.setShortWeekNames([
	'日', '一', '二', '三', '四', '五', '六'
]);
m_DateTime = gDt.format('Y/m/d (w) H:M:S');
*/

function _do(_event, _bot) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);
	
	let msgR;
	let p2r_sendMsg;
	let cmdCatched = true;

	let total_ToroCards;
	let toroCards_t;
	let toroCards_tt;
	let total_TfCards;
	let total_KuziCards;
	let total_AsaCards; 
	let total_tg;
	let total_tb;
	let toroCards_tsm;

	let num_weather = 0, num_tg = 0, num_tb = 0, num_toro = 0, num_tfhouse = 0;
	let num_alive = 0;
	let num_kuzi = 0, num_asa = 0;
	let num_ai_reaction = 0;
	let num_mgr = 0;
	
	let num_ptt_1 = 0, num_baha_1 = 0, num_tos_1 = 0, num_g8g_1 = 0;
	let num_ptt_2 = 0, num_baha_2 = 0, num_tos_2 = 0, num_g8g_2 = 0;

	// 如果指令來源不是 SU_GIDX指定的群組，就直接return false;
	if (idx !== SU_GIDX) return false;

	switch (msg) {
	case '*wc':
		// 前面加上一個 '祕' 的unicode圖案
		msgR = '\u{03299}' + s.suc_wc;	
		//console.log(s);
		break;

	// P2R	
	//▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ Test for P2R ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
	case '*p2r-announce':
		/*
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n' + 
			'★[新增]PTT、巴哈、神魔官網、G8GAME，以回應的方式自動提供新文。\n' +
			'土司小妹可在有新文產生時，將新文資料存入系統，待有人發訊時再回覆新文訊息。' +  '\n\n' +
			'\uDBC0\uDC2D群組管理者可透過「121~124:on/off」指令進行開關該功能。' + '\n\n' + 
			'\uDBC0\uDC60相關指令可用「群組指令」或「群組狀態」進行查詢，謝謝。\n\n' +
			'或詳情可參考 ' +
			decodeURIComponent('https://ppt.cc/fALMzx');
		*/
		/*
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n'
			+ '「魔彩菱石」的模擬抽卡，已經可以試玩囉。\n'
			+ '祝大家都可以抽到理想的卡。\n\n'
			+ '\uDBC0\uDC2D另外提醒一下，沒有特殊需求(e.g.競技...)的情況下，建議等加倍再抽。'
			+ '因為沒加倍35抽內能抽好抽滿的只有60%，但加倍下，35內抽好抽滿的機率有92%。\n\n'
			+ '\uDBC0\uDC60其他指令可用「小妹指令」進行查詢，'
			+ '或詳情可參考 '
			+ decodeURIComponent('https://ppt.cc/fALMzx');
		*/
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n' + 
			'★[新增]指令「抽好抽滿」以及「加倍抽好抽滿」比照MH官方新增保底機制判斷是否抽好抽滿。\n' +
			'第35抽送素材可將重覆的2獎換另一張沒抽到的2獎。' +  '\n\n' +
			'\uDBC0\uDC2D群組管理者可透過「5:on/off」指令進行開關該功能。' + '\n\n' + 
			'\uDBC0\uDC60相關指令可用「群組指令」或「群組狀態」進行查詢，謝謝。\n\n' +
			'或詳情可參考 ' +
			decodeURIComponent('https://ppt.cc/fALMzx');	
		push2reply.add_announceMsg(p2r_sendMsg).save(groupDB);
		break;

	case '*p2r-clearall':
		push2reply.clearAll_p2rMsgs().save(groupDB);
		break;

	case '*p2r-show':
		console.log(groupDB[SU_GIDX]);
		break;
	
	case '*p2r-showall':
		console.log(groupDB);
		break;
	
	case '*p2r-clear-1':
		push2reply.clearGroup_p2rMsgs(SU_GIDX);
		break;

	case '*p2r-clear-2':
		push2reply.clearGroup_p2rMsgs(SU_GIDX);
		push2reply.clearGroup_p2rMsgs(c.GIDX_SUPERMAN).save(groupDB);
		break;

	case '*p2r-test-addmsgToWayneTest':
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n'
			+ '「生命靈泉」的模擬抽卡，已經可以試玩囉。\n'
			+ '祝大家都可以抽到理想的卡。\n\n'
			+ '\uDBC0\uDC2D另外提醒一下，沒有特殊需求(e.g.競技...)的情況下，建議等加倍再抽。'
			+ '因為沒加倍35抽內能抽好抽滿的只有60%，但加倍下，35內抽好抽滿的機率有92%。\n\n'
			+ '\uDBC0\uDC60其他指令可用「小妹指令」進行查詢，'
			+ '或詳情可參考 '
			+ decodeURIComponent('https://ppt.cc/fALMzx');
		push2reply.add_aP2RMsg_to_aGroup('announce', SU_GIDX, p2r_sendMsg);
		push2reply.add_aP2RMsg_to_aGroup('tos', SU_GIDX, 'tos msg comming').save(groupDB);
		break;
		//▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ Test for P2R ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

	case 'w小妹計':
		total_ToroCards = parseInt(toro_db.total_torocards); // 統計所有抽的卡數(加倍 + 未加倍)
		toroCards_t = parseInt(toro_db.torocards_t); 		// 統計所有抽的卡數(未加倍)
		toroCards_tt = parseInt(toro_db.torocards_tt); 		// 統計所有抽的卡數(加倍)
		total_TfCards = parseInt(toro_db.total_tfcards);		// 統計所有討伐開房圖數
		total_KuziCards = parseInt(toro_db.total_kuzicards);	// 統計所有60甲子籤數
		total_AsaCards = parseInt(toro_db.total_asacards);	// 統計所有淺草觀音100的籤數
		total_tg = parseInt(toro_db.total_tg);				// 統計所有抽美女的數量
		total_tb = parseInt(toro_db.total_tb);				// 統計所有抽帥哥的數量
		toroCards_tsm = parseInt(toro_db.total_tsm);			// 統計所有抽的卡數(超人卡匣)
		msgR = '小妹起床時間：\n' + m_DateTime + '\n\n'
			+ '未加倍抽卡數 = ' + toroCards_t + '\n'
			+ '加倍抽卡數 = ' + toroCards_tt + '\n'
			+ '總數 = ' + total_ToroCards + '\n\n'
			+ '討伐催房總數 = ' + total_TfCards + '\n'
			+ '六十甲子抽籤數 = ' + total_KuziCards + '\n'
			+ '淺草觀音抽籤數 = ' + total_AsaCards + '\n'
			+ '抽美女卡數 = ' + total_tg + '\n'
			+ '抽帥哥卡數 = ' + total_tb + '\n'
			+ '超人卡匣卡數 = ' + toroCards_tsm + '\n\n'
			+ '群組數 = ' +  groupDB.length;
		break;
	
	case 'w總群態':
		for (let i = 0; i < groupDB.length; i++){
			if (groupDB[i].is_alive == true){	// 群組為有效群組，再進行統計
				num_alive++;
				if (groupDB[i].sw_push_weather == true) num_weather++;
				if (groupDB[i].sw_tg == true) num_tg++;
				if (groupDB[i].sw_tb == true) num_tb++;
				if (groupDB[i].sw_toro == true) num_toro++;
				if (groupDB[i].sw_kuzi == true) num_kuzi++;
				if (groupDB[i].sw_asa == true) num_asa++;
				if (groupDB[i].tosmm_ai_reaction == true) num_ai_reaction++;
				if (groupDB[i].mgr_id !== '???') num_mgr++;
				if (groupDB[i].sw_tfhouse == true) num_tfhouse++;
				if (groupDB[i].sw_ptt_1 == true) num_ptt_1++;
				if (groupDB[i].sw_baha_1 == true) num_baha_1++;
				if (groupDB[i].sw_tos_1 == true) num_tos_1++;
				if (groupDB[i].sw_g8g_1 == true) num_g8g_1++;
				if (groupDB[i].p2r_sw.ptt == true) num_ptt_2++;
				if (groupDB[i].p2r_sw.baha == true) num_baha_2++;
				if (groupDB[i].p2r_sw.tos == true) num_tos_2++;
				if (groupDB[i].p2r_sw.g8g == true) num_g8g_2++;
			}
		}
		msgR = '天氣報:' + num_weather + '/' + num_alive + '\n' +
			'抽美女:' + num_tg + '/' + num_alive + '\n' +
			'抽帥哥:' + num_tb + '/' + num_alive + '\n' +
			'抽卡匣:' + num_toro + '/' + num_alive + '\n' +
			'抽籤:' + num_kuzi + '/' + num_alive + '\n' +
			'運勢:' + num_asa + '/' + num_alive + '\n' +
			'開房:' + num_tfhouse + '/' + num_alive + '\n' +
			'PTT:' + num_ptt_1 + '/' + num_alive + '\n' +
			'BAHA:' + num_baha_1 + '/' + num_alive + '\n' +
			'TOS:' + num_tos_1 + '/' + num_alive + '\n' +
			'G8G:' + num_g8g_1 + '/' + num_alive + '\n' +
			'--------' + '\n' +
			'PTT自:' + num_ptt_2 + '/' + num_alive + '\n' +
			'BAHA自:' + num_baha_2 + '/' + num_alive + '\n' +
			'TOS自:' + num_tos_2 + '/' + num_alive + '\n' +
			'G8G自:' + num_g8g_2 + '/' + num_alive + '\n' +
			'--------' + '\n' +
			'AI回應:' + num_ai_reaction + '/' + num_alive + '\n' +
			'管理者:' + num_mgr + '/' + num_alive + '\n' +
			'有效群:' + num_alive + '/' + groupDB.length + '\n' +
			'總發言人數:' + usr_mgr.getTotalUsersCount();
		break;
	
	case 'w群列表0':
		// 只在console印出，不reply
		msgR = usr_mgr.getAllGroupSimpleInfo(_event, false);
		break;
	
	case 'w群列表1':
		// 只在console印出，不reply
		msgR = usr_mgr.getAllGroupSimpleInfo(_event, true);
		break;	
	
	default:
		cmdCatched = false;
		break;
	}
	if (cmdCatched) {
		_bot.getGroupMemberProfile(gID, uID).then((profile) => {
			_event.reply(msgR)
				.then(() => {	
					fmlog('command_msg',
						['GN:' + groupDB[idx].gname, idx, msg,
							msgR, profile.displayName, uID]);
				});
		});
	}
	return cmdCatched;
}

//////////////  Module Exports //////////////////
module.exports = {
	do : _do
};