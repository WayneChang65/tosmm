'use strict';

const LV0 = 0, LV1 = 1, LV2 = 2, LV3 = 3, LV4 = 4,
	LV5 = 5, LV6 = 6, LV7 = 7, LV8 = 8, LV9 = 9;

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

}

function _calExpValue() {
	
}

function _calLevel(_expVal) {
	let retVal;
	if (_expVal === 0) retVal = LV0;
	else if (0 < _expVal < 100) 		retVal = LV1;
	else if (100 <= _expVal < 500) 		retVal = LV2;
	else if (500 <= _expVal < 1000) 	retVal = LV3;
	else if (1000 <= _expVal < 2000)	retVal = LV4;
	else if (2000 <= _expVal < 4000)	retVal = LV5;
	else if (4000 <= _expVal < 8000) 	retVal = LV6;
	else if (8000 <= _expVal < 15000) 	retVal = LV7;
	else if (15000 <= _expVal < 50000) 	retVal = LV8;
	else if (50000 <= _expVal < 100000) retVal = LV9;
	else if (100000 <= _expVal) 		retVal = LV10;
	else throw new Error('_calLevel: Data Error.');
}

//////////////  Module Exports //////////////////
module.exports = {
	msg: _msg
};