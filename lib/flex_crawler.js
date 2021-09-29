'use strict';

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
		"layout": "vertical",
		"contents": [{
			"type": "box",
			"layout": "vertical",
			"contents": [{
					"type": "box",
					"layout": "vertical",
					"contents": [{
							"type": "text",
							"contents": [],
							"size": "xl",
							"wrap": true,
							"text": "第21屆台比(利時)經濟合作會議：「智慧交通：電動車」產業交流",
							"color": "#ffffff",
							"weight": "bold"
						},
						{
							"type": "text",
							"text": "IDB",
							"color": "#ffffffcc",
							"size": "sm"
						}
					],
					"spacing": "sm"
				},
				{
					"type": "box",
					"layout": "vertical",
					"contents": [{
						"type": "button",
						"action": {
							"type": "uri",
							"label": "Click for Detail",
							"uri": "https://bit.ly/3uipkF"
						},
						"height": "sm",
						"style": "secondary",
						"margin": "none"
					}],
					"paddingAll": "13px",
					"backgroundColor": "#ffffff1A",
					"cornerRadius": "2px",
					"margin": "xl"
				}
			]
		}],
		"paddingAll": "20px",
		"backgroundColor": "#464F69"
	},
	"styles": {
		"footer": {
			"separator": true
		}
	}
};

/* eslint-enable */

function _msg(_title, _href, _type) {
	switch (_type) {
	case 'IDB':
		_prefix.altText = 'IDB New Message';
		_basicFrame.body.backgroundColor = '#003366';
		break;
	case 'SM':
		_prefix.altText = 'SM New Message';
		_basicFrame.body.backgroundColor = '#004d66';
		break;
	case 'PMC':
		_prefix.altText = 'PMC New Message';
		_basicFrame.body.backgroundColor = '#3d3d5c';
		break;
	case 'TMBA':
		_prefix.altText = 'TMBA New Message';
		_basicFrame.body.backgroundColor = '#464F69';
		break;
	}
	_basicFrame.body.contents[0].contents[0].contents[0].text = _title;
	_basicFrame.body.contents[0].contents[0].contents[1].text = _type;
	_basicFrame.body.contents[0].contents[1].contents[0].action.uri = _href;
	_basicFrame.body.contents[0].contents[1].contents[0].action.label = _href;
	_prefix.contents = _basicFrame;
	return _prefix;
}

//////////////  Module Exports //////////////////
module.exports = {
	msg: _msg
};
