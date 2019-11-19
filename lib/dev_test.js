'use strict';
const cmd_ana = require('./cmd_ana.js');
const usr_mgr = require('./usr_mgr.js').init();
const c = require('./const_def.js').init();
const weather_info = require('./weather_info.js');
const flex_weather = require('./flex_weather.js');

function _do(_event, _bot) {
	let msg = _event.message.text;
	let cmdCatched = true;
	let groupDB = usr_mgr.getGDB();
	let _prefix;
	let temp;
	switch (msg) {
	case '?test1':
		cmd_ana.save();
		break;
	case '?test2':
		_prefix = {
			type: 'flex',
			altText: '土司小妹-群組指令',
			contents: {}
		};
		// Flex msg使用雙引號，原因是從Line的Flex msg simulator只支援雙引號
		// 若改單引號，simulator會有錯誤。所以，這裏暫時性關掉ESLint.
		/* eslint-disable */
		temp = {
			"type": "bubble",
			"size": "mega",
			"body": {
			  "type": "box",
			  "layout": "vertical",
			  "contents": [
				{
				  "type": "box",
				  "layout": "vertical",
				  "contents": [
					{
					  "type": "text",
					  "text": "群組指令",
					  "weight": "bold",
					  "size": "xl",
					  "margin": "md"
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
							  "type": "image",
							  "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5DrIssZn4DIU90vpuUhvuqa9shsfdmzBT8yDRxIzPMU9l3Ofb&s",
							  "size": "xxs",
							  "flex": 3
							},
							{
							  "type": "text",
							  "text": "主人好，我是土司小妹ロボ。",
							  "style": "normal",
							  "decoration": "none",
							  "flex": 27,
							  "color": "#9F0050"
							}
						  ]
						},
						{
						  "type": "text",
						  "text": "很高興為主人們服務。",
						  "color": "#9F0050"
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
				  "contents": [
					{
					  "type": "text",
					  "text": "以下是群組專屬指令：",
					  "weight": "bold",
					  "size": "lg"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "群組指令",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "本說明",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "群組狀態",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "BJ4",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "1:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 天氣預報",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "3:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 抽美女",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "4:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 抽帥哥",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "5:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 神魔抽卡",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "6:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 抽籤",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "7:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 運勢",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "8:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 AI回應",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "9:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 討伐催房",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "11:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 PTT新訊",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "12:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 巴哈新訊",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#000000",
						  "text": "13:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 官網新訊",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "14:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 G8Gl新訊",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "separator",
					  "color": "#e0e0e0"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "121:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 PTT自動新訊",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "122:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 巴哈自動新訊",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "123:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 官網自動新訊",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
					},
					{
					  "type": "box",
					  "layout": "baseline",
					  "contents": [
						{
						  "type": "text",
						  "flex": 5,
						  "color": "#3A006F",
						  "text": "124:on/off",
						  "style": "italic",
						  "weight": "bold"
						},
						{
						  "type": "text",
						  "text": "啟閉 G8G自動新訊",
						  "flex": 6,
						  "color": "#000000"
						}
					  ],
					  "margin": "xs"
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
		_prefix.contents = temp;
		_event.reply(_prefix);
		break;
	case '?test3':
		_bot.push(groupDB[c.GIDX_WTESTFIRE].gid, 'test push'); // 小妹測試空間-火妍
		break;
	case '?test11':
		weather_info.updateWeatherInfoByReply(_event);
		break;
	case '?test12':
		weather_info.updateWeatherInfoByP2R();
		break;
	case '?test21':
		console.log(c);
		break;
	case '?test555':
		temp = [{
			area: '台北',
			temp: '27 ℃ ~ 31 ℃',
			rain: '0',
			aqi: '30'
		},
		{
			area: '新竹',
			temp: '21 ℃ ~ 30 ℃',
			rain: '100',
			aqi: '80'
		},
		{
			area: '台中',
			temp: '20 ℃ ~ 23 ℃',
			rain: '50',
			aqi: '120'
		},
		{
			area: '南投',
			temp: '23 ℃ ~ 29 ℃',
			rain: '90',
			aqi: '130'
		},
		{
			area: '高雄',
			temp: '21 ℃ ~ 30 ℃',
			rain: '100',
			aqi: '170'
		}
		];
		temp = flex_weather.msg('土司天氣預報-2019/11/05', '2019/11/05  06:20am', temp);
		_event.reply(temp);
		console.log(temp);
		break;
	default:
		cmdCatched = false;
		break;
	}
	return cmdCatched;
}

//////////////  Module Exports //////////////////
module.exports = {
	do : _do
};