'use strict';
const cmd_ana = require('./cmd_ana.js');
const usr_mgr = require('./usr_mgr.js').init();
const c = require('./const_def.js').init();
const weather_info = require('./weather_info.js');
const flex_weather = require('./flex_weather.js');
const flex_level = require('./flex_level.js');
const temp_info = require('./temp_info.js');
const crawler = require('./crawler.js');
const flex_crawler = require('./flex_crawler.js');
const flex_crawler2 = require('./flex_crawler2.js');

// Super User Group ID
let SU_GIDX =  c.TOSMM_SU_GIDX;

function _do(_event, _bot) {
	let msg = _event.message.text;
	let cmdCatched = true;
	let groupDB = usr_mgr.getGDB();
	let gID = _event.source.groupId;
	let idx = usr_mgr.getGIDX(gID);
	let _prefix;
	let temp;
	let stringTQ = '';

	// 如果指令來源不是 SU_GIDX指定的群組，就直接return false;
	if (idx !== SU_GIDX) return false;

	switch (msg) {
	case 'l!savedb':
		flex_level.save();
		break;
	case '?test01':	// 新增userDB 裏面的 rank值 (全部User都加)
		usr_mgr.modify_userDB_rank();
		break;	
	case '?test00':	// 只增加level這個switch開關訊息
		usr_mgr.modify_groupDB_level();
		break;	
	case 'l!001':
		flex_level.showUserLevelInfo(_event);
		break;
	case 'w手動排序':// 測試排序
		flex_level.rankSort().save();
		break;
	case 'l!003':
		break;
	case 'l!004':
		flex_level.show(_event, _bot);
		break;	
	case 'l!005':
		flex_level.testAllColor(_event, _bot);
		break;
	case '?test000':
		temp = flex_level.fmsg_basic();
		_event.reply(temp);
		break;
	case '?test001':
		temp = '\u{1F505}\u{1F506}【智機辦】\u{2728}\u{3299}\n';
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
	case '?test31':
		temp_info.getTempInfo();
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
	case '?tq':
		_bot.getQuota().then((result_q) => {
			stringTQ = 'Quota: ' + result_q.value + '\n';
			console.log(stringTQ);
		});
		break;
	case '?tp':
		//_bot.getGroupProfile(groupDB[c.GIDX_SUPERMAN].gid).then((result) => {
		_bot.getGroupProfile(groupDB[214].gid).then((result) => {	
			_event.reply('This is the group(' + result.groupName + ').\n' + 
				'groupID : ' + result.groupId + '\n' +
				'picUrl : ' + result.pictureUrl);
		});
		break;
	case '?tgc':
		_bot.getGroupMembersCount(groupDB[c.GIDX_SUPERMAN].gid).then((result) => {	
			_event.reply('Group Members Count: ' + result.count);
		});
		break;
	case 'tc2':
		getConsoleLog();
		break;
	case 'ttff1': 
		_event.reply(flex_crawler.msg('2021臺灣循環經濟週總動員 產官研攜手建構永續綠台灣', 'https://bit.ly/39FwU3i', 'IDB'));
		break;
	case 'ttff2': 
		_event.reply(flex_crawler.msg('14家企業榮獲第6屆卓越中堅企業獎', 'https://bit.ly/39FwU3i', 'SM'));
		break;
	case 'ttff3': 
		_event.reply(flex_crawler.msg('深化鏈結臺德國際平台標準 建構安全、穩定、韌性供應鏈 布局全球市場 拓展智慧機械商機', 'https://bit.ly/39FwU3i', 'PMC'));
		break;
	case 'ttff4': 
		_event.reply(flex_crawler.msg('Hello', 'https://bit.ly/39FwU3i', 'TMBA'));
		break;	
	case 'ff1': 
		_event.reply(flex_crawler2.msg('2021臺灣循環經濟週總動員 產官研攜手建構永續綠台灣', 'https://bit.ly/39FwU3i', 'IDB'));
		break;
	case 'ff2': 
		_event.reply(flex_crawler2.msg('14家企業榮獲第6屆卓越中堅企業獎', 'https://bit.ly/39FwU3i', 'SM'));
		break;
	case 'ff3': 
		_event.reply(flex_crawler2.msg('深化鏈結臺德國際平台標準 建構安全、穩定、韌性供應鏈 布局全球市場 拓展智慧機械商機', 'https://bit.ly/39FwU3i', 'PMC'));
		break;
	case 'ff4': 
		_event.reply(flex_crawler2.msg('Hello', 'https://bit.ly/39FwU3i', 'TMBA'));
		break;		
	default:
		cmdCatched = false;
		break;
	}
	return cmdCatched;
}

async function getConsoleLog() {
	console.log(await crawler.idbCrawler());
}

//////////////  Module Exports //////////////////
module.exports = {
	do : _do
};