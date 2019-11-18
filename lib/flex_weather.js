'use strict';
const c = require('./const_def.js').init();

// 最基本的 土司天氣預報 的 flex msg組成是
// _prefix + _basicFrame(視情況 push _anAreaItem 以及 _aSeparator)
// 第一個天氣項目： push _anAreaItem
// 第二個以後的天氣項目： push _aSeparator + push _anAreaItem

const _prefix = {
	type: 'flex',
	altText: '土司小妹-天氣預報',
	contents: {}
};

// Flex msg使用雙引號，原因是從Line的Flex msg simulator只支援雙引號
// 若改單引號，simulator會有錯誤。所以，這裏暫時性關掉ESLint.
/* eslint-disable */
const _basicFrame = {
	"type": "bubble",
	"size": "mega",
	"body": {
		"type": "box",
		"layout": "vertical",
		"contents": [{
			"type": "box",
			"layout": "horizontal",
			"contents": [{
				"type": "text",
				"text": "土司天氣預報",
				"weight": "bold",
				"color": "#1DB446",
				"size": "sm",
				"margin": "none",
				"flex": 4
			},
			{
				"type": "text",
				"text": "2019/11/04",
				"size": "xs",
				"color": "#bebebe",
				"flex": 6
			}
			]
		},
		{
			"type": "separator",
			"margin": "md",
			"color": "#ffffff"
		} //, 從這後面 push _anAreaItem物件
		]
	},
	"styles": {
		"footer": {
			"separator": true
		}
	}
};

const _anAreaItem = {
	"type": "box",
	"layout": "horizontal",
	"contents": [{
		"type": "box",
		"layout": "baseline",
		"contents": [{
			"type": "icon",
			"url": "https://wayne65.ap.ngrok.io/lb_images/flex/weather/sunny.png",
			"size": "xxl"
		},
		{
			"type": "text",
			"text": "台北",
			"weight": "bold",
			"size": "xxl",
			"margin": "md"
		}
		],
		"flex": 4
	},
	{
		"type": "box",
		"layout": "vertical",
		"contents": [{
			"type": "text",
			"text": "25 ℃ ~ 30 ℃",
			"size": "xl",
			"align": "end"
		},
		{
			"type": "box",
			"layout": "horizontal",
			"contents": [{
				"type": "text",
				"text": "0 %",
				"flex": 5,
				"align": "end"
			},
			{
				"type": "box",
				"layout": "horizontal",
				"contents": [{
					"type": "text",
					"text": "AQI 30",
					"align": "center"
				}],
				"borderWidth": "1px",
				"borderColor": "#000000",
				"cornerRadius": "5px",
				"backgroundColor": "#28FF28",
				"flex": 5,
				"margin": "lg"
			}
			]
		}
		],
		"flex": 6
	}
	],
	"margin": "none"
};

const _aSeparator = {
	"type": "separator",
	"margin": "lg",
	"color": "#bebebe"
};
/* eslint-enable */

function _getWeatherSignUrl(_rainPossibility) {
	let weatherSignUrl;
	if (_rainPossibility < 30) {
		weatherSignUrl = c.TOSMM_TORO_PIC_PATH + 'flex/weather/sunny.png';
	} else if (_rainPossibility >= 30 && _rainPossibility < 70){
		weatherSignUrl = c.TOSMM_TORO_PIC_PATH + 'flex/weather/cloudy.png';
	} else {
		weatherSignUrl = c.TOSMM_TORO_PIC_PATH + 'flex/weather/rainy.png';
	}
	return weatherSignUrl;
}

function _getAirColor(_aqi) {
	let ret = '';
	if (_aqi >= 0 && _aqi < 51){			// 綠-良好
		ret = '#00FF00';
	}else if (_aqi >= 51 && _aqi < 101){	// 黃-普通
		ret = '#FFFF00';
	}else if (_aqi >= 101 && _aqi < 151){	// 橘-對敏感族群不健康
		ret = '#FFA500';
	}else if (_aqi >= 151 && _aqi < 201){	// 紅-對所有族群不健康
		ret = '#FF0000';
	}else if (_aqi >= 201 && _aqi < 301){	// 紫-非常不健康
		ret = '#B399FF';
	}else if (_aqi >= 301 && _aqi < 501){	// 棕-危害
		ret = '#B8860B';
	}
	return ret;
}

function _msg(_alt_txt, _date, _area_items) {
	if(!_date || !_area_items) return;

	// 做 Object Deep Copy
	let prefix = JSON.parse(JSON.stringify(_prefix));
	let basicFrame = JSON.parse(JSON.stringify(_basicFrame));

	prefix.altText = _alt_txt,
	basicFrame.body.contents[0].contents[1].text = _date;
	
	for (let i = 0; i < _area_items.length; i++) {
		if (i > 0) basicFrame.body.contents.push(_aSeparator);

		let anAreaItem = JSON.parse(JSON.stringify(_anAreaItem));

		anAreaItem.contents[0].contents[0].url = 
			_getWeatherSignUrl(parseInt(_area_items[i].rain));
		anAreaItem.contents[0].contents[1].text = _area_items[i].area;
		anAreaItem.contents[1].contents[0].text = _area_items[i].temp;
		anAreaItem.contents[1].contents[1].contents[0].text = _area_items[i].rain + ' %';
		anAreaItem.contents[1].contents[1].contents[1].contents[0].text = 'AQI ' + _area_items[i].aqi;
		anAreaItem.contents[1].contents[1].contents[1].backgroundColor = 
			_getAirColor(parseInt(_area_items[i].aqi));

		basicFrame.body.contents.push(anAreaItem);
	}
	
	prefix.contents = basicFrame;
	return prefix;
}
//////////////  Module Exports //////////////////
module.exports = {
	msg: _msg
};