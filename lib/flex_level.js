'use strict';
const usr_mgr = require('./usr_mgr.js').init();

const LV0 = 0, LV1 = 1, LV2 = 2, LV3 = 3, LV4 = 4,
	LV5 = 5, LV6 = 6, LV7 = 7, LV8 = 8, LV9 = 9, LV10 = 10;

const _prefix = {
	type: 'flex',
	altText: '土司小妹-等級',
	contents: {}
};

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

function _msg() {
	_prefix.contents = _basicFrame;
	return _prefix;
}

// 取得使用者的等級
function _getUserLevel(_event) {
	let uID = _event.source.userId;
	console.log('uID: ' + uID);
	if (uID){
		let usrDB = usr_mgr.getUDB();
		let idx = usr_mgr.getUIDX(uID);
		let numSpeaking = usrDB[idx].levelsys.speaking;
		let numPic = usrDB[idx].levelsys.pic;
		let numTosmm = usrDB[idx].levelsys.tosmm;
		console.log('speaking: ' + numSpeaking + ' pic: ' + numPic + ' numTosmm: ' + numTosmm);
		let expVal = _calExpValue(numSpeaking, numPic, numTosmm);
		console.log('expVal: ' + expVal);
		let usrLevel = _calLevel(expVal);
		console.log(usrLevel);

		return usrLevel;
	}
}

function _calExpValue(_numSpeaking, _numPic, _numTosmm) {
	return _numSpeaking * 1 + _numPic * 2 + _numTosmm * 3;
}

function _calLevel(_expVal) {
	let retVal = {};

	if (_expVal === 0){
		retVal.lv = LV0;
		retVal.percent = 0;
	}else if (_expVal > 0 && _expVal < 100){
		retVal.lv = LV1;
		retVal.percent = _expVal * 100 / 100;
	}else if (_expVal >= 100 && _expVal < 500){
		retVal.lv = LV2;
		retVal.percent = _expVal * 100 / 500;
	}else if (_expVal >= 500 && _expVal < 1000){
		retVal.lv = LV3;
		retVal.percent = _expVal * 100 / 1000;
	}else if (_expVal >= 1000 && _expVal < 2000){
		retVal.lv = LV4;
		retVal.percent = _expVal * 100 / 2000;
	}else if (_expVal >= 2000 && _expVal < 4000){
		retVal.lv = LV5;
		retVal.percent = _expVal * 100 / 4000;
	}else if (_expVal >= 4000 && _expVal < 8000){
		retVal.lv = LV6;
		retVal.percent = _expVal * 100 / 8000;
	}else if (_expVal >= 8000 && _expVal < 15000){
		retVal.lv = LV7;
		retVal.percent = _expVal * 100 / 15000;
	}else if (_expVal >= 15000 && _expVal < 50000){
		retVal.lv = LV8;
		retVal.percent = _expVal * 100 / 50000;
	}else if (_expVal >= 50000 && _expVal < 100000){
		retVal.lv = LV9;
		retVal.percent = _expVal * 100/ 100000;
	}else if (_expVal >= 100000){
		retVal.lv = LV10;
		retVal.percent = 0;
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
	let afterSort = Object.assign([], beforeSort);	// Deep Copy
	afterSort.sort((a, b) => b - a);	// 大排到小
	console.log(beforeSort);
	console.log(afterSort);
}

//////////////  Module Exports //////////////////
module.exports = {
	msg : _msg,
	getUserLevel : _getUserLevel,
	sort321_test : _sort321_test
};