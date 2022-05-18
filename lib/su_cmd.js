'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
const usr_mgr = require('./usr_mgr.js').init();
const push2reply = require('./push2reply.js');
const basic_f = require('./basic_f.js');
const c = require('./const_def.js').init();
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const crawler = require('./crawler.js');
const cmd_ana = require('./cmd_ana.js');
const flex_level = require('./flex_level.js');
const update_gdb = require('./update_gdb.js');
const cc = require('../json/cc_db.json');

// 目前設定 小妹測試空間(火妍)
// Super User Group ID
let SU_GIDX =  c.TOSMM_SU_GIDX;

// 本程式開始執行的時間
let m_DateTime = basic_f.getCurrentDateTime();

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

	let num_level = 0;

	// 如果指令來源不是 SU_GIDX指定的群組，就直接return false;
	if (idx !== SU_GIDX) return false;

	switch (msg) {
	case '*wc':
		// 前面加上一個 '祕' 的unicode圖案
		msgR = '\u{03299}' + s.suc_wc;	
		break;
	
	case '*ccdb':
		// 顯示指令統計資料
		msgR = '*ccdb';
		console.log(cmd_ana.get_ccDB());	
		break;

	// P2R	
	//▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ Test for P2R ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
	case '*p2r-announce':
		/*
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n'
			+ '「嶄新時代」的模擬抽卡，已經可以試玩囉。\n'
			+ '祝大家都可以抽到理想的卡。\n\n'
			+ '\uDBC0\uDC2D另外提醒一下，嶄新時代的卡片共14張，加上有較低機率的卡片，'
			+ '所以「抽好抽滿」的模擬抽卡張數，可能會嚇您一跳，僅供參考。\n\n'
			+ '\u{1F613}另外，直到最近才有空更新程式至可支援超過8張抽卡機功能，也請見諒。Orz' + '\n\n'
			+ '\uDBC0\uDC60其他指令可用「小妹指令」進行查詢，'
			+ '或詳情可參考 '
			+ decodeURIComponent('https://ppt.cc/fKYa0x');
		*/
		
		/*
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n' + 
			'★[新增]瓶中信，意見與回報功能(beta)\n' +
			'提供一個對土司小妹ロボ的意見提供與錯誤回報機制與功能。' +  '\n\n' +
			'\uDBC0\uDC2D用法：利用「瓶中信」指令，然後加上1個空格，後面接著打您要對土司小妹的意見即可。' + '\n\n' + 
			'\u{27A1}範例1：瓶中信 土司小妹可否增加「抽100」的功能？感恩。' + '\n' + 
			'\u{27A1}範例2：瓶中信 「week」功能目前無效，可否確認一下？謝謝。' + '\n\n' + 
			'\u{1F613}另外，因為本人被魔物追著打以及護石地獄所擾，所以鬼滅沒更新抽卡，也請見諒。Orz' + '\n\n' + 
			'詳情可參考 ' +
			decodeURIComponent('https://ppt.cc/fKYa0x');
		*/	
		/*
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n' + 
			'★[公告]土司小妹ロボ 在Github開放原始碼。\n' +
			'請有志之士一同共襄盛舉，也別忘給個星星，感謝您。' +  '\n\n' +
			decodeURIComponent('https://github.com/WayneChang65/tosmm');
		*/
		/*
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n' + 
			'★[公告]群組活躍度等級系統說明。(beta)\n' +
			'因為本系統還是beta階段，所以很可能經驗值歸0，所以請大家不要太重視這個系統。' +  '\n\n' +
			'\uDBC0\uDC2D本系統資料庫一天存一次，如果中間系統維修或當掉，也會造成當天經驗值沒儲存。所以各位請平常心使用。' + '\n\n' + 
			'\uDBC0\uDC2D本系統設有每日有經驗值上限。' + '\n\n' + 
			'\uDBC0\uDC60相關指令可用「群組指令」或「群組狀態」進行查詢，謝謝。\n\n' +
			'或詳情可參考 ' +
			decodeURIComponent('https://ppt.cc/fKYa0x');
		*/
		/*
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n' + 
			'★[公告]群組活躍度等級系統更新。(beta)\n' +
			'本系統beta階段，經驗值記錄可能被清除或重置。' +  '\n\n' +
			'\uDBC0\uDC2D新增me右上角排序顯示功能。前10名活躍的玩家，星星顯示。' + '\n\n' + 
			'\uDBC0\uDC2D排序不會依照經驗值立刻生效，而是在每天半夜某時段進行排序更新。' + '\n\n' + 
			'\uDBC0\uDC2D針對洗分洗得太誇張的人，違反本功能最初用意，後端判斷機制自動扣分。' + '\n\n' + 
			'\uDBC0\uDC60相關指令可用「群組指令」或「群組狀態」進行查詢，謝謝。\n\n' +
			'或詳情可參考 ' +
			decodeURIComponent('https://ppt.cc/fKYa0x');
		*/
		/*
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n' + 
			'★[新增]群組活躍度等級系統。(beta)\n' +
			'群組內，無論發言、小妹抽卡、上傳照片等...活動，均可提升經驗值，且等級隨經驗值提升。' +  '\n\n' +
			'\uDBC0\uDC2D群組管理者可透過「131:on/off」指令進行開關該功能。(Default:ON)' + '\n\n' + 
			'\uDBC0\uDC2D玩家可透過「me」指令進行自己等級卡片查詢。' + '\n\n' + 
			'\uDBC0\uDC60相關指令可用「群組指令」或「群組狀態」進行查詢，謝謝。\n\n' +
			'或詳情可參考 ' +
			decodeURIComponent('https://ppt.cc/fKYa0x');	
		*/
	
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n'
			+ '「神玉封印 II」的模擬抽卡，已經可以試玩囉。\n'
			+ '祝大家都可以抽到理想的卡。\n\n'
			+ '\uDBC0\uDC2D另外提醒一下，沒有特殊需求(e.g.競技...)的情況下，建議等加倍再抽。'
			+ '因為沒加倍35抽內能抽好抽滿的只有60%，但加倍下，35內抽好抽滿的機率有92%。\n\n'
			+ '\uDBC0\uDC60其他指令可用「小妹指令」進行查詢，'
			+ '或詳情可參考 '
			+ decodeURIComponent('https://ppt.cc/fKYa0x');
		
		/*
		p2r_sendMsg = '\uDBC0\uDC96【土司公告】主人好。\n' + 
			'★[維護]天氣預報的溫溼度功能暫時關閉。\n' +
			'由於中央氣象局從3/31起，官網由V7改版至V8，導致土司小妹抓資料出現問題。' + 
			'所以，暫時關閉該功能。(目前只顯示空氣AQI)。待修正後，再進行開放。' +  '\n\n' +
			'\uDBC0\uDC2D群組管理者可透過「1:on/off」指令進行開關該功能。' + '\n\n' + 
			'\uDBC0\uDC60相關指令可用「群組指令」或「群組狀態」進行查詢，謝謝。\n\n' +
			'或詳情可參考 ' +
			decodeURIComponent('https://ppt.cc/fKYa0x');
		*/	
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
		p2r_sendMsg = 
			'\uDBC0\uDC96【土司公告】主人好。\n' + 
			'★[新增]瓶中信，意見與回報功能(beta)\n' +
			'提供一個對土司小妹ロボ的意見提供與錯誤回報機制與功能。' +  '\n\n' +
			'\uDBC0\uDC2D用法：利用「瓶中信」指令，然後加上1個空格，後面接著打您要對土司小妹的意見即可。' + '\n\n' + 
			'\u{27A1}範例1：瓶中信 土司小妹可否增加「抽100」的功能？感恩。' + '\n' + 
			'\u{27A1}範例2：瓶中信 「week」功能目前無效，可否確認一下？謝謝。' + '\n\n' + 
			'\u{1F613}另外，因為韋恩把拔被魔物追著打還有護石地獄所擾，所以鬼滅沒更新抽卡，也請見諒。Orz' + '\n\n' + 
			'詳情可參考 ' +
			decodeURIComponent('https://ppt.cc/fKYa0x');
		/*
			'\uDBC0\uDC96【土司公告】主人好。\n'
			+ '「生命靈泉」的模擬抽卡，已經可以試玩囉。\n'
			+ '祝大家都可以抽到理想的卡。\n\n'
			+ '\uDBC0\uDC2D另外提醒一下，沒有特殊需求(e.g.競技...)的情況下，建議等加倍再抽。'
			+ '因為沒加倍35抽內能抽好抽滿的只有60%，但加倍下，35內抽好抽滿的機率有92%。\n\n'
			+ '\uDBC0\uDC60其他指令可用「小妹指令」進行查詢，'
			+ '或詳情可參考 '
			+ decodeURIComponent('https://ppt.cc/fKYa0x');
		*/
		push2reply.add_aP2RMsg_to_aGroup('announce', SU_GIDX, p2r_sendMsg);
		push2reply.add_aP2RMsg_to_aGroup('tos', SU_GIDX, 'tos msg comming').save(groupDB);
		break;
		//▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ Test for P2R ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

	case 'w小妹計':
		// 統計所有抽的卡數(未加倍)
		toroCards_t = cc.CMD_toro + cc.CMD_toro10 * 10 + cc.CMD_tfull * 35;
		// 統計所有抽的卡數(加倍)
		toroCards_tt = cc.CMD_dtoro + cc.CMD_dtoro10 * 10 + cc.CMD_dtfull * 35;
		// 統計所有抽的卡數(加倍 + 未加倍)
		total_ToroCards = toroCards_t + toroCards_tt;
		// 統計所有討伐開房圖數
		total_TfCards = cc.CMD_tf;
		// 統計所有60甲子籤數
		total_KuziCards = cc.CMD_kuzi;
		// 統計所有淺草觀音100的籤數
		total_AsaCards = cc.CMD_asa;
		// 統計所有抽美女的數量
		total_tg = cc.CMD_tg;
		// 統計所有抽帥哥的數量
		total_tb = cc.CMD_tb;
		// 統計所有抽的卡數(超人卡匣)
		toroCards_tsm = cc.CMD_tsm;
		// 取得目前Push Quota數量
		_bot.getQuota().then((result_q) => {
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
			+ 'Push Quota = ' + result_q.value;
		});
		break;

	case 'w總群態':
		for (let i = 0; i < groupDB.length; i++){
			if (groupDB[i].is_alive == true){	// 群組為有效群組，再進行統計
				num_alive++;
				//if (groupDB[i].sw_push_weather == true) num_weather++;
				if (groupDB[i].p2r_sw.weather == true) num_weather++;
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
				if (groupDB[i].sw_level == true) num_level++;
			}
		}
		msgR = '小妹起床時間：\n' + m_DateTime + '\n\n' +
			'天氣報:' + num_weather + '/' + num_alive + '\n' +
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
			'LV系統:' + num_level + '/' + num_alive + '\n' +
			'--------' + '\n' +
			'AI回應:' + num_ai_reaction + '/' + num_alive + '\n' +
			'管理者:' + num_mgr + '/' + num_alive + '\n' +
			'有效群:' + num_alive + '/' + groupDB.length + '\n' +
			'總發言人數:' + usr_mgr.getTotalUsersCount();
		
		cmd_ana.save();
		flex_level.rankSort().save();
		break;
	
	case 'w群列表0':
		// 未來有空再來格式化，以利cli觀看
		console.log(usr_mgr.getAllGroupSimpleInfo(_event, false));
		break;
	
	case 'w群列表1':
		// 未來有空再來格式化，以利cli觀看
		console.log(usr_mgr.getAllGroupSimpleInfo(_event, true));
		break;	
	
	case 'w短址狀態':
		crawler.getAccountsStatus().then((result) => {
			console.log(result);
			_event.reply('Valid : ' + result.valid + ', Total : ' + result.total);
		});
		break;
	
	case 'w更新群組資料庫':
		// 從LINE伺服器取得群組基本資料(包含isAlive, 群組名, 人數, 大頭貼連結)
		update_gdb.do(_event, _bot);
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