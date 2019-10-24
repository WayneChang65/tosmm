'use strict';
const nodejieba = require('nodejieba');
nodejieba.load({
	//userDict: './dict.txt',
	dict: './res/dict.txt',
});
const tosmm_db = require('../res/tosmm_db.json');
const basic_f = require('./basic_f.js');
const usr_mgr = require('./usr_mgr.js').init();
const cmd_ana = require('./cmd_ana.js');
const fmlog = require('@waynechang65/fml-consolelog').log;

/**
 * [將輸入的中文句子斷句]
 * @param       {[string]} _sentence [要被斷句的句子]
 * @constructor
 * @return      {[Array]}           [已被斷句的句子]
 */
function _seperateSentence(_sentence){
	return nodejieba.cut(_sentence);
}

/**
 * [處理將傳入斷好詞的句子，分析出語意(Intent)，並做出相關對應動作。]
 * @param {array} _arySeperatedSentence [傳入已經斷詞好的詞陣列]
 * @param {object} _bot                 [linebot 物件]
 * @param {object} _event               [linebot 事件物件]
 */
function _reaction(_event, _bot, _arySeperatedSentence) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);

	return tosmm_db.every(element => {
		let entry_1 = false;
		let entry_2 = false;
		let entry_3 = false;
		let entry_4 = false;
		let entry_5 = false;

		for (let i = 0; i < _arySeperatedSentence.length; i++) {
			if (element.entry_1.includes('*')) {
				entry_1 = true;
				break;
			} // 如果 db裏面有 '*'，就true了。
			entry_1 = element.entry_1.includes(_arySeperatedSentence[i]);
			//console.log(_arySeperatedSentence[i] + '-entry1-' + entry_1.toString());
			if (entry_1) break;
		}
		for (let i = 0; i < _arySeperatedSentence.length; i++) {
			if (element.entry_2.includes('*')) {
				entry_2 = true;
				break;
			} // 如果 db裏面有 '*'，就true了。
			entry_2 = element.entry_2.includes(_arySeperatedSentence[i]);
			//console.log(_arySeperatedSentence[i] + '-entry2-' + entry_2.toString());
			if (entry_2) break;
		}
		for (let i = 0; i < _arySeperatedSentence.length; i++) {
			if (element.entry_3.includes('*')) {
				entry_3 = true;
				break;
			} // 如果 db裏面有 '*'，就true了。
			entry_3 = element.entry_3.includes(_arySeperatedSentence[i]);
			//console.log(_arySeperatedSentence[i] + '-entry3-' + entry_3.toString());
			if (entry_3) break;
		}
		for (let i = 0; i < _arySeperatedSentence.length; i++) {
			if (element.entry_4.includes('*')) {
				entry_4 = true;
				break;
			} // 如果 db裏面有 '*'，就true了。
			entry_4 = element.entry_4.includes(_arySeperatedSentence[i]);
			//console.log(_arySeperatedSentence[i] + '-entry4-' + entry_4.toString());
			if (entry_4) break;
		}
		for (let i = 0; i < _arySeperatedSentence.length; i++) {
			if (element.entry_5.includes('*')) {
				entry_5 = true;
				break;
			} // 如果 db裏面有 '*'，就true了。
			entry_5 = element.entry_5.includes(_arySeperatedSentence[i]);
			//console.log(_arySeperatedSentence[i] + '-entry5-' + entry_5.toString());
			if (entry_5) break;
		}
		if (entry_1 && entry_2 && entry_3 && entry_4 && entry_5) {
			let reaction_sentense = element.reaction[basic_f.getRandom(0, element.reaction.length - 1)];
			
			cmd_ana.nlp(element.intent_no);	// Command Count (CC)

			_bot.getGroupMemberProfile(gID, uID).then((profile) => {
				_event.reply('\uDBC0\uDC37' + profile.displayName + ', ' + reaction_sentense)
					.then(() => {
						fmlog('command_msg',
							['GN:' + groupDB[idx].gname, idx, msg,
								reaction_sentense, profile.displayName, uID
							]);
					});
			});
			return false;
		} else {
			return true;
		}
	});
}

function _talk(_event, _bot) {
	let gID = _event.source.groupId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);
	
	if(groupDB[idx].tosmm_ai_reaction)
		return (_reaction(_event, _bot, _seperateSentence(_event.message.text))) ?
			false : true;
}

//////////////  Module Exports //////////////////
module.exports = {
	talk : _talk
};