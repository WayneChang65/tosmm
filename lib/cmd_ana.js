'use strict';
const fs = require('fs');
const json5 = require('json5');
const fmlog = require('@waynechang65/fml-consolelog').log;

const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const cc = require('../json/cc_db.json');

function _do(_event/*, _bot*/) {
	let msg = _event.message.text;

	switch (msg) {
	case '抽美女':
		cc.CMD_tg++;
		break;
	case '抽帥哥':
		cc.CMD_tb++;
		break;
	case '運勢':
		cc.CMD_asa++;	
		break;
	case '超人運勢':
		cc.CMD_smasa++;	
		break;
	case '抽籤':
		cc.CMD_kuzi++;
		break;
	case '抽':
		cc.CMD_toro++;	
		break;
	case '抽超人':
		cc.CMD_tsm++;	
		break;		
	case '加倍抽':
		cc.CMD_dtoro++;
		break;
	case '抽十':
		cc.CMD_toro10++;
		break;
	case '加倍抽十':
		cc.CMD_dtoro10++;
		break;
	case '抽好抽滿':
		cc.CMD_tfull++;
		break;	
	case '加倍抽好抽滿':
		cc.CMD_dtfull++;	
		break;	
	case '開房':
		cc.CMD_tf++;
		break;
	
	// 以下指令為 無開關控制
	case '抽卡機率':
		cc.CMD_tr++;
		break;
	case '加倍機率':
		cc.CMD_dtr++;
		break;
	case '土司小妹':
		cc.CMD_tosmm++;
		break;
	case '小妹指令':
		cc.CMD_mmcmd++;
		break;
	case '群組指令':
		cc.CMD_gcmd++;
		break;
	case '群組狀態':
		cc.CMD_gstaus++;
		break;
	case '1:on': 	case '1:off':	
	case '3:on': 	case '3:off':
	case '4:on': 	case '4:off':
	case '5:on': 	case '5:off':
	case '6:on': 	case '6:off':
	case '7:on': 	case '7:off':
	case '8:on': 	case '8:off':
	case '9:on': 	case '9:off':
	case '11:on': 	case '11:off':									
	case '12:on': 	case '12:off':								
	case '13:on': 	case '13:off':								
	case '14:on': 	case '14:off':								
	case '121:on': 	case '121:off':								
	case '122:on': 	case '122:off':								
	case '123:on': 	case '123:off':						
	case '124:on': 	case '124:off':
	case '131:on': 	case '131:off':
		break;

	case '小妹請私':
		break;
	case 'ptt':		case 'Ptt':		case 'PTT':
		cc.CMD_ptt++;
		break;
	case '巴哈':	case 'baha':	case 'BAHA': 	case 'Baha':
		cc.CMD_baha++;
		break;
	case 'tos': 	case 'TOS': 	case 'Tos':
		cc.CMD_tos++;
		break;
	case 'g8g': 	case 'G8G': 	case 'G8g':
		cc.CMD_g8g++;
		break;
	case '本週活動':	case 'week':	case 'WEEK':	case 'Week':
		cc.CMD_week++;
		break;
	default:
		break;
	}
}

function _nlp(_intent_no) {
	cc['RE_Intent_' + (_intent_no).toString()]++;    // Command Count (CC)
}

function _save_ccDB_toJSON(){
	fs.writeFile('./json/cc_db.json', JSON.stringify(cc), function(err){
		if(err) throw err;
		fmlog('sys_msg', [s.ca_json, s.ca_wdbok]);
	});
}

function _get_ccDB() {
	return cc;
}

//////////////  Module Exports //////////////////
module.exports = {
	do : _do,
	nlp: _nlp,
	save: _save_ccDB_toJSON,
	get_ccDB: _get_ccDB
};