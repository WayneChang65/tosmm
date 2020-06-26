'use strict';

const _prefix = {
	type: 'flex',
	altText: '土司小妹-群組狀態',
	contents: {}
};

// Flex msg使用雙引號，原因是從Line的Flex msg simulator只支援雙引號
// 若改單引號，simulator會有錯誤。所以，這裏暫時性關掉ESLint.
/* eslint-disable */
const _basicFrame = {
	"type": "bubble",
	"size": "kilo",
	"body": {
		"type": "box",
		"layout": "vertical",
		"contents": [{
				"type": "box",
				"layout": "vertical",
				"contents": [{
						"type": "text",
						"text": "群組狀態",
						"weight": "bold",
						"size": "xl",
						"margin": "md"
					},
					{
						"type": "box",
						"layout": "horizontal",
						"contents": [{
								"type": "text",
								"text": "群組管理者：",
								"flex": 5
							},
							{
								"type": "text",
								"text": "Wayne Chang+++++++++++++++++++++++++++++++++++++++++",
								"flex": 7
							}
						],
						"margin": "md"
					}
				]
			},
			{
				"type": "separator",
				"margin": "xs"
			},
			{
				"type": "box",
				"layout": "vertical",
				"margin": "xxl",
				"spacing": "sm",
				"contents": [{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "1. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "天氣預報",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "3. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "抽美女",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "4. ",
								"flex": 3,
								"color": "#adadad"
							},
							{
								"type": "text",
								"text": "抽帥哥",
								"flex": 6,
								"color": "#adadad"
							},
							{
								"type": "text",
								"text": "【OFF】",
								"flex": 4,
								"color": "#adadad"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "5. ",
								"flex": 3,
								"color": "#adadad"
							},
							{
								"type": "text",
								"text": "神魔抽卡",
								"flex": 6,
								"color": "#adadad"
							},
							{
								"type": "text",
								"text": "【OFF】",
								"flex": 4,
								"color": "#adadad"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "6. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "抽籤",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "7. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "運勢",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "8. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "AI 回應",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "9. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "討伐開房",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "11. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "PTT 新訊",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "12. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "巴哈 新訊",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "13. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "官網 新訊",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "14. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "...",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "...",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "separator",
						"color": "#e0e0e0"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "121. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "PTT 自動新訊",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "122. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "巴哈 自動新訊",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "123. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "官網 自動新訊",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "124.",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "...",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "...",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					},
					{
						"type": "separator"
					},
					{
						"type": "box",
						"layout": "baseline",
						"contents": [{
								"type": "text",
								"text": "131. ",
								"flex": 3,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "等級系統",
								"flex": 6,
								"color": "#000000"
							},
							{
								"type": "text",
								"text": "【ON】",
								"flex": 4,
								"color": "#000000"
							}
						],
						"margin": "none"
					}
				],
				"offsetTop": "-10px"
			}
		]
	},
	"styles": {
		"footer": {
			"separator": true
		}
	}
};
/* eslint-enable */

function _msg(_manager, _aryIsOn) {
	const items = 17;	// 這裏指有 群組狀態 有17個items
	if (_aryIsOn.length !== items) throw new Error('_aryIsOn.length !== ' + String(items));

	_basicFrame.body.contents[0].contents[1].contents[1].text = _manager;

	let j = 0;
	for (let i = 0; i < items; i++) {
		if (i === 12) j = 1;	// 跳過第12項，因為是seperator(+1, 1個seperator)
		if (i === 16) j = 2;	// 跳過第16項，因為是seperator(+2, 2個seperator)
		if (_aryIsOn[i]) {
			_basicFrame.body.contents[2].contents[i + j].contents[0].color = '#000000';
			_basicFrame.body.contents[2].contents[i + j].contents[1].color = '#000000';
			_basicFrame.body.contents[2].contents[i + j].contents[2].color = '#000000';
			_basicFrame.body.contents[2].contents[i + j].contents[2].text = '【ON】';
		}else{
			_basicFrame.body.contents[2].contents[i + j].contents[0].color = '#adadad';
			_basicFrame.body.contents[2].contents[i + j].contents[1].color = '#adadad';
			_basicFrame.body.contents[2].contents[i + j].contents[2].color = '#adadad';
			_basicFrame.body.contents[2].contents[i + j].contents[2].text = '【OFF】';
		}
	}
	_prefix.contents = _basicFrame;
	return _prefix; 
}

//////////////  Module Exports //////////////////
module.exports = {
	msg: _msg
};