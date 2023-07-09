'use strict';
const usr_mgr = require('./usr_mgr.js').init();
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const c = require('./const_def.js').init();

const LV0 = 0, LV1 = 1, LV2 = 2, LV3 = 3, LV4 = 4,
	LV5 = 5, LV6 = 6, LV7 = 7, LV8 = 8, LV9 = 9, LV10 = 10;

const _prefix = {
	type: 'flex',
	altText: '土司小妹-等級',
	contents: {}
};

let colorIdx = 0;


// Flex msg使用雙引號，原因是從Line的Flex msg simulator只支援雙引號
// 若改單引號，simulator會有錯誤。所以，這裏暫時性關掉ESLint.
/* eslint-disable */
const _basicFrame = {
	"type": "bubble",
	"body": {
	  "type": "box",
	  "layout": "vertical",
	  "contents": [
		{
		  "type": "box",
		  "layout": "vertical",
		  "margin": "none",
		  "spacing": "sm",
		  "contents": [
			{
			  "type": "box",
			  "layout": "horizontal",
			  "contents": [
				{
				  "type": "box",
				  "layout": "baseline",
				  "contents": [
					{
					  "type": "icon",
					  "url": "https://data.tosapp.tw/source/plugin/webtech_tosys/data/card/card_309.png",
					  "size": "4xl",
					  "margin": "none"
					},
					{
					  "type": "text",
					  "text": "L0",
					  "size": "xs",
					  "color": "#F9F900",
					  "position": "absolute",
					  "offsetTop": "30px",
					  "weight": "bold",
					  "offsetStart": "5px",
					  "style": "normal",
					  "decoration": "underline",
					  "margin": "none"
					}
				  ],
				  "margin": "none",
				  "flex": 3
				},
				{
				  "type": "box",
				  "layout": "vertical",
				  "contents": [
					{
					  "type": "box",
					  "layout": "horizontal",
					  "contents": [
						{
						  "type": "box",
						  "layout": "vertical",
						  "contents": [
							{
							  "type": "box",
							  "layout": "vertical",
							  "contents": [
								{
								  "type": "filler"
								}
							  ],
							  "backgroundColor": "#0D8186",
							  "height": "6px",
							  "width": "70%"
							}
						  ],
						  "backgroundColor": "#9FD8E36E",
						  "height": "6px",
						  "flex": 5,
						  "margin": "none",
						  "position": "relative",
						  "spacing": "none"
						},
						{
						  "type": "text",
						  "text": "100%",
						  "offsetTop": "-2px",
						  "size": "xxs",
						  "flex": 3,
						  "margin": "sm",
						  "color": "#c0c0c0"
						},
						{
						  "type": "text",
						  "text": "# 123456",
						  "flex": 5,
						  "size": "sm",
						  "margin": "md",
						  "color": "#0047ab",
						  "weight": "bold",
						  "gravity": "top",
						  "align": "end",
						  "offsetTop": "-2px"
						}
					  ],
					  "height": "15px"
					},
					{
					  "type": "text",
					  "text": "Wayne Chang 主人您好",
					  "margin": "none"
					},
					{
					  "type": "text",
					  "text": "您還是L0，請加加油。",
					  "margin": "none"
					}
				  ],
				  "flex": 8,
				  "margin": "none"
				}
			  ],
			  "margin": "none"
			}
		  ]
		}
	  ],
	  "margin": "none"
	},
	"styles": {
	  "body": {
		"backgroundColor": "#ff92a0"
	  },
	  "footer": {
		"separator": false
	  }
	}
  };
/* eslint-enable */

function _fmsg_basic() {
	_prefix.contents = _basicFrame;
	return _prefix;
}

// 取得使用者的等級
function _showUserLevelInfo(_event) {
	let uID = _event.source.userId;
	let gID = _event.source.groupId;
	console.log('uID: ' + uID);
	let usrDB;
	let idx;
	let numSpeaking;
	let numPic;
	let numTosmm;
	let username;
	let pic;
	let levelsys;

	if (uID){
		try {
			usrDB = usr_mgr.getUDB();
			idx = usr_mgr.getUIDX(uID);
			numSpeaking = usrDB[idx].levelsys.speaking;
			numPic = usrDB[idx].levelsys.pic;
			numTosmm = usrDB[idx].levelsys.tosmm;
			username = usrDB[idx].username;
			pic = usrDB[idx].pic;
			levelsys = usrDB[idx].levelsys;
		} catch (error) {
			username = undefined;
			pic = undefined;
			numSpeaking = 0;
			numPic = 0;
			numTosmm = 0;
			levelsys = 0;
			//fmlog('error_msg', ['flex_level', s.fl_uduser, ' ']);
			fmlog('error_msg', ['flex_level_sl', s.fl_uduser, 'gID:' + gID]);
		}
		
		console.log('username: ' + username);
		console.log('pic: ' + pic);
		console.log('speaking: ' + numSpeaking + ' pic: ' + numPic + ' numTosmm: ' + numTosmm);
		console.log('levelsys: ' + levelsys);
	}
}

function _calExpValue(_numSpeaking, _numPic, _numTosmm) {
	return _numSpeaking * 1 + _numPic * 2 + _numTosmm * 3;
}

function _calLevel(_expVal) {
	let retVal = {};

	if (_expVal >= 0 && _expVal < 50){
		retVal.lv = LV0;
		retVal.slv = 'L0';
		retVal.percent = _expVal * 100 / (50 - 0);
		retVal.comment = s.fl_lv0;
		retVal.bkcolor = '#FFFFFF';
	}else if (_expVal >= 50 && _expVal < 100){
		retVal.lv = LV1;
		retVal.slv = 'L1';
		retVal.percent = (_expVal - 50) * 100 / (100 - 50);
		retVal.comment = s.fl_lv1;
		retVal.bkcolor = '#D5FEF1';
	}else if (_expVal >= 100 && _expVal < 500){
		retVal.lv = LV2;
		retVal.slv = 'L2';
		retVal.percent = (_expVal - 100) * 100 / (500 - 100);
		retVal.comment = s.fl_lv2;
		retVal.bkcolor = '#FFF5D7';
	}else if (_expVal >= 500 && _expVal < 1000){
		retVal.lv = LV3;
		retVal.slv = 'L3';
		retVal.percent = (_expVal - 500) * 100 / (1000 - 500);
		retVal.comment = s.fl_lv3;
		retVal.bkcolor = '#F5FDCD';
	}else if (_expVal >= 1000 && _expVal < 2000){
		retVal.lv = LV4;
		retVal.slv = 'L4';
		retVal.percent = (_expVal - 1000) * 100 / (2000 - 1000);
		retVal.comment = s.fl_lv4;
		retVal.bkcolor = '#D6E4FF';
	}else if (_expVal >= 2000 && _expVal < 4000){
		retVal.lv = LV5;
		retVal.slv = 'L5';
		retVal.percent = (_expVal - 2000) * 100 / (4000 - 2000);
		retVal.comment = s.fl_lv5;
		retVal.bkcolor = '#FFE6D6';
	}else if (_expVal >= 4000 && _expVal < 8000){
		retVal.lv = LV6;
		retVal.slv = 'L6';
		retVal.percent = (_expVal - 4000) * 100 / (8000 - 4000);
		retVal.comment = s.fl_lv6;
		retVal.bkcolor = '#ACFDEB';
	}else if (_expVal >= 8000 && _expVal < 15000){
		retVal.lv = LV7;
		retVal.slv = 'L7';
		retVal.percent = (_expVal - 8000) * 100 / (15000 - 8000);
		retVal.comment = s.fl_lv7;
		retVal.bkcolor = '#FFE8AF';
	}else if (_expVal >= 15000 && _expVal < 50000){
		retVal.lv = LV8;
		retVal.slv = 'L8';
		retVal.percent = (_expVal - 15000) * 100 / (50000 - 15000);
		retVal.comment = s.fl_lv8;
		retVal.bkcolor = '#E8FC9C';
	}else if (_expVal >= 50000 && _expVal < 100000){
		retVal.lv = LV9;
		retVal.slv = 'L9';
		retVal.percent = (_expVal - 50000) * 100/ (100000 - 50000);
		retVal.comment = s.fl_lv9;
		retVal.bkcolor = '#ADC8FF';
	}else if (_expVal >= 100000){
		retVal.lv = LV10;
		retVal.slv = 'L10';
		retVal.percent = 0;
		retVal.comment = s.fl_lv10;
		retVal.bkcolor = '#FFC7AD';
	}else{
		throw new Error('_calLevel: Data Error.');
	}
	retVal.percent = Math.floor(retVal.percent); //無條件捨去
	return retVal;
}

// 排序測試。從數字大到小的排序。
// output:
// [ 2, 1, 413, 123123, 43, 1, 0, 11, 43432, 22, 34234, 0 ]
// [ 123123, 43432, 34234, 413, 43, 22, 11, 2, 1, 1, 0, 0 ]
// 未來針對所有使用者的經驗值排序使用
function _sort321_test() {
	let beforeSort = [2, 1, 413, 123123, 43, 1, 0, 11, 43432, 22, 34234, 0];
	let afterSort = Object.assign([], beforeSort);	// Deep Copy(1 Level)
	afterSort.sort((a, b) => b - a);	// 大排到小
	console.log(beforeSort);
	console.log(afterSort);
}

function _sort321_test_2(/*_event, _bot*/) {
	let aryBeforeSort_EXP = [];
	let usrDB = usr_mgr.getUDB();
	
	for (let i = 0; i < usrDB.length; i++) {
		aryBeforeSort_EXP.push({
			exp : usrDB[i].levelsys.exp,
			rank : 0	
		});
	}

	let aryAfterSorted_EXP = Object.assign([], aryBeforeSort_EXP);	// Deep Copy(1 Level)

	aryAfterSorted_EXP = aryAfterSorted_EXP.sort(function (a, b) {
		return a.exp < b.exp ? 1 : -1;
	});

	console.log(aryAfterSorted_EXP);

	for (let i = 0; i < aryAfterSorted_EXP.length; i++) {
		if(i !== 0) {
			if (aryAfterSorted_EXP[i].exp === aryAfterSorted_EXP[i - 1].exp) {
				aryAfterSorted_EXP[i].rank = aryAfterSorted_EXP[i - 1].rank;
			} else {
				aryAfterSorted_EXP[i].rank = i;
			}
		} 
	}
	console.log(aryAfterSorted_EXP);
}
// 前排法
function _rankSort() {
	try {
		let usrDB = usr_mgr.getUDB();

		usrDB = usrDB.sort(function (a, b) {
			return a.levelsys.exp < b.levelsys.exp ? 1 : -1;
		});

		for (let i = 0; i < usrDB.length; i++) {
			if (i !== 0) {
				if (usrDB[i].levelsys.exp === usrDB[i - 1].levelsys.exp) {
					usrDB[i].levelsys.rank = usrDB[i - 1].levelsys.rank;
				} else {
					usrDB[i].levelsys.rank = i;
				}
			} else {
				usrDB[i].levelsys.rank = 0;
			}
			if (usrDB[i].levelsys.exp === 0) usrDB[i].levelsys.rank = usrDB.length - 1;
		}
		//console.log(usrDB);
		fmlog('sys_msg', ['flex_level_s', 'The rank has Sorted!']);
		return this;
	} catch (error) {
		fmlog('error_msg', ['_rankSort', error, '...']);
		return;
	}
}

function _show(_event, _bot, _levelup) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let gIdx = usr_mgr.getGIDX(gID);

	let usrDB;
	let uIdx;
	let numSpeaking;
	let numPic;
	let numTosmm;

	try {
		usrDB = usr_mgr.getUDB();
		uIdx = usr_mgr.getUIDX(uID);
		numSpeaking = usrDB[uIdx].levelsys.speaking;
		numPic = usrDB[uIdx].levelsys.pic;
		numTosmm = usrDB[uIdx].levelsys.tosmm;
	} catch (error) {
		fmlog('error_msg', ['flex_level_s', s.fl_uduser, 'gID:' + gID]);
		return;	// User 資訊無法取得 (應該是保護)
	}


	_bot.getGroupMemberProfile(gID, uID).then((profile) => {
		let expVal = _calExpValue(numSpeaking, numPic, numTosmm);
		let usrLevel = _calLevel(expVal);

		usrDB[uIdx].username = profile.displayName;
		usrDB[uIdx].pic = profile.pictureUrl;
		usrDB[uIdx].levelsys.exp = expVal;
		usrDB[uIdx].levelsys.percent = usrLevel.percent;
		usrDB[uIdx].levelsys.lv = usrLevel.lv;

		_prefix.contents = _basicFrame;
		let fmsg = _prefix;
		let fmsg_body = _prefix.contents.body;


		let strRank = '# 0';
		switch (usrDB[uIdx].levelsys.rank) {
		case 0: case 1: case 2: case 3: case 4:
		case 5: case 6: case 7: case 8: case 9:
			strRank = '★';		
			break;
		
		default:
			strRank = '# ' + (usrDB[uIdx].levelsys.rank + 1).toString();
			break;
		}


		fmsg_body.backgroundColor = usrLevel.bkcolor;
		fmsg_body.contents[0].contents[0].contents[0].contents[1].decoration 
			= 'none';
		fmsg_body.contents[0].contents[0].contents[1].contents[0].contents[2].text
			//= '#0'; //'#123456';
			= strRank;
		fmsg_body.contents[0].contents[0].contents[0].contents[0].url 
			= profile.pictureUrl;
		fmsg_body.contents[0].contents[0].contents[1].contents[2].text
			= usrLevel.comment;
		fmsg_body.contents[0].contents[0].contents[1].contents[1].text 
			= profile.displayName.slice(0, 11) + ' 主人您好';	// 限名字長度10
		fmsg_body.contents[0].contents[0].contents[0].contents[1].text 
			= usrLevel.slv;
		fmsg_body.contents[0].contents[0].contents[1].contents[0].contents[1].text 
			= usrLevel.percent.toString() + '%';
		fmsg_body.contents[0].contents[0].contents[1].contents[0].contents[0].contents[0].width 
			= usrLevel.percent.toString() + '%';

		if (!profile.pictureUrl) return;
		if (groupDB[gIdx].sw_level) {
			_event.reply(fmsg).then(() => {	
				if (_levelup) return;	// 如果升級自動顯示，就不show以下指令操作訊息
				fmlog('command_msg',
					['GN:' + groupDB[gIdx].gname, gIdx, msg,
						profile.pictureUrl.slice(-47), profile.displayName, uID]);
			});
		}else{
			if (_levelup) return;	// 如果升級自動顯示，就不show以下指令操作訊息
			fmlog('command_msg',
				['GN:' + groupDB[gIdx].gname, gIdx, msg,
					profile.pictureUrl.slice(-47), profile.displayName, uID]);
		}
	});
}

function _testAllColor(_event/*, _bot*/) {
	let color = ['#FFFFFF', '#D5FEF1', '#FFF5D7', '#F5FDCD', '#D6E4FF',
		'#FFE6D6', '#ACFDEB', '#FFE8AF', '#E8FC9C', '#ADC8FF', '#FFC7AD'];
	if (colorIdx >= 11) colorIdx = 0;
	_prefix.contents.body.backgroundColor = color[colorIdx++];
	_event.reply(_prefix);
}

function _save() {
	let usrDB = usr_mgr.getUDB();
	usr_mgr.saveUDB(usrDB);
}

function _retainExp(_event, _bot, _type) {
	let gID = _event.source.groupId;
	let uID;
	let usrDB;
	let uIdx;
	let cmdCatched = false;

	try {
		uID = _event.source.userId;
		usrDB = usr_mgr.getUDB();
		uIdx = usr_mgr.getUIDX(uID);
	} catch (error) {
		fmlog('error_msg', ['flex_level_r', s.fl_uduser, 'gID:' + gID]);
		return;
	}

	switch (_type) {
	case c.LV_SPEAKING:
		usrDB[uIdx].levelsys.speaking++;
		//usrDB[uIdx].levelsys.speaking+=50;
		break;
	case c.LV_PIC:
		usrDB[uIdx].levelsys.pic++;
		break;
	case c.LV_TOSMM:
		usrDB[uIdx].levelsys.tosmm++;
		break;		
	default:
		throw new Error('_retainExp: Unkonwn type.');
		//break;
	}

	let numSpeaking = usrDB[uIdx].levelsys.speaking;
	let numPic = usrDB[uIdx].levelsys.pic;
	let numTosmm = usrDB[uIdx].levelsys.tosmm;
	let expVal = _calExpValue(numSpeaking, numPic, numTosmm);
	let usrLevel = _calLevel(expVal);

	usrDB[uIdx].levelsys.exp = expVal;
	usrDB[uIdx].levelsys.percent = usrLevel.percent;

	if(usrDB[uIdx].levelsys.lv !== usrLevel.lv) {	// 升級了
		usrDB[uIdx].levelsys.lv = usrLevel.lv;
		let lvDetail = 'speaking: ' + numSpeaking + ', pic: ' + numPic + ', numTosmm: ' + numTosmm;
		fmlog('event_msg', [s.fl_lvup, '【 L' + usrLevel.lv.toString() + ' 】 ' + usrDB[uIdx].username, 
			lvDetail]);
		cmdCatched = true;
		if(usrLevel.lv !== LV0) _show(_event, _bot, c.LV_LEVELUP);	// 剛上1級，不顯示名片
	}

	return cmdCatched;
	//_showUserLevelInfo(_event);	// 顯示在console使用者等級資訊(後續可mark掉)

	/*
	_bot.getGroupMemberProfile(gID, uID).then((profile) => {
		usrDB[uIdx].username = profile.displayName;
		usrDB[uIdx].pic = profile.pictureUrl;
	});
	*/
}
//////////////  Module Exports //////////////////
module.exports = {
	show : _show,
	showUserLevelInfo : _showUserLevelInfo,
	retainExp : _retainExp,
	fmsg_basic : _fmsg_basic,
	save :_save,

	rankSort : _rankSort,

	testAllColor :_testAllColor,
	sort321_test : _sort321_test,
	sort321_test_2 : _sort321_test_2
	
};