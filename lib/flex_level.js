'use strict';

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

//////////////  Module Exports //////////////////
module.exports = {
	msg: _msg
};