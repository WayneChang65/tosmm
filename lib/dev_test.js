'use strict';
const cmd_ana = require('./cmd_ana.js');
const usr_mgr = require('./usr_mgr.js').init();
const c = require('./const_def.js').init();
const weather_info = require('./weather_info.js');
const flex_weather = require('./flex_weather.js');
const flex_level = require('./flex_level.js');


function _do(_event, _bot) {
	let msg = _event.message.text;
	let cmdCatched = true;
	let groupDB = usr_mgr.getGDB();
	let _prefix;
	let temp;
	switch (msg) {
	case '?test0':
		usr_mgr.modify_userDB();
		break;
	case '?test000':
		temp = flex_level.msg();
		_event.reply(temp);
		break;
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
							  "flex": 10,
							  "margin": "none"
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
			  "footer": {
				"separator": false
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