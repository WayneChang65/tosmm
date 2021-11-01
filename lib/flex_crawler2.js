'use strict';
const c = require('./const_def.js').init();

const _prefix = {
	type: 'flex',
	altText: '土司小妹-爬蟲',
	contents: {}
};

// Flex msg使用雙引號，原因是從Line的Flex msg simulator只支援雙引號
// 若改單引號，simulator會有錯誤。所以，這裏暫時性關掉ESLint.
/* eslint-disable */
const _basicFrame = {
	"type": "bubble",
	"body": {
	  "type": "box",
	  "layout": "horizontal",
	  "contents": [
		{
		  "type": "box",
		  "layout": "vertical",
		  "contents": [
			{
			  "type": "image",
			  "url": "https://wayne65.ap.ngrok.io/lb_images/flex/crawler/pmc.png",
			  "aspectMode": "cover"
			},
			{
			  "type": "text",
			  "text": "TMBA",
			  "size": "xxs",
			  "align": "center",
			  "margin": "md"
			}
		  ]
		},
		{
		  "type": "box",
		  "layout": "vertical",
		  "margin": "lg",
		  "spacing": "sm",
		  "contents": [
			{
			  "type": "box",
			  "layout": "baseline",
			  "spacing": "sm",
			  "contents": [
				{
				  "type": "text",
				  "text": "【TMBA重要公告】本會110年會員大會延期辦理，造成不便，敬請見諒!!",
				  "size": "md",
				  "flex": 1,
				  "gravity": "center",
				  "wrap": true,
				  "color": "#000000",
				  "weight": "bold"
				}
			  ]
			},
			{
			  "type": "box",
			  "layout": "baseline",
			  "spacing": "sm",
			  "contents": [
				{
				  "type": "text",
				  "text": "https://bit.ly/3m7CnFJ",
				  "color": "#aaaaaa",
				  "size": "sm",
				  "flex": 1
				}
			  ]
			}
		  ],
		  "flex": 6
		}
	  ],
	  "action": {
		"type": "uri",
		"label": "action",
		"uri": "https://bit.ly/3m7CnFJ"
	  }
	}
  };

/* eslint-enable */

function _msg(_title, _href, _type) {
	const baseLogoUrl = c.TOSMM_TORO_PIC_PATH_FLEX + 'crawler/';
	let logoUrl;
	switch (_type) {
	case 'IDB':
		_prefix.altText = 'IDB New Message';
		logoUrl = baseLogoUrl + 'idb.png';
		break;
	case 'SM':
		_prefix.altText = 'SM New Message';
		logoUrl = baseLogoUrl + 'sm.png';
		break;
	case 'PMC':
		_prefix.altText = 'PMC New Message';
		logoUrl = baseLogoUrl + 'pmc.png';
		break;
	case 'TMBA':
		_prefix.altText = 'TMBA New Message';
		logoUrl = baseLogoUrl + 'tmba.png';
		break;
	case 'TIIP':
		_prefix.altText = 'TIIP New Message';
		logoUrl = baseLogoUrl + 'tiip.png';
		break;	
	}
	_basicFrame.body.contents[0].contents[0].url = logoUrl;
	_basicFrame.body.contents[0].contents[1].text = _type;
	_basicFrame.body.contents[1].contents[0].contents[0].text = _title;
	_basicFrame.body.contents[1].contents[1].contents[0].text = _href;
	_basicFrame.body.action.uri = _href;

	_prefix.contents = _basicFrame;
	return _prefix;
}

//////////////  Module Exports //////////////////
module.exports = {
	msg: _msg
};
