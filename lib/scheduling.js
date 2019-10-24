'use strict';
const basic_f = require('./basic_f.js');
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));

// 功能：設定每天某個特定時間觸發，然後執行某個函式，並且可以設定今天開始或明天開始。
//      ★★★接著，以後每天都會在固定時間觸發執行程式。
// 參數：_runningFunc：設定時間到之後，要執行什麼函式，函式指標傳入
//      _alarmTime：設定Push的固定時間，格式：xx:yy, 例：13:12 (13點12分, 24小時制)
//      _beginFrom：只有兩個值 TODAY, TOMORROW。從今天或明天開始。
//      _consoleString1：給console看的字串1
//      _consoleString2：給console看的字串2
function _setCyclicTimer_Do_Everyday(_event, _bot,
	_runningFunc, _alarmTime, _beginFrom, _consoleString1, _consoleString2) {
	let aryAlarmTime = _alarmTime.split(':');
	//console.log(aryAlarmTime);
	setTimeout(function() {
		fmlog('crawler_msg', [s.sch_schedling, s.sch_1st,
			'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);
		_runningFunc(_event, _bot);
		setInterval(function() {
			fmlog('crawler_msg', [s.sch_schedling, s.sch_24h,
				'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);
			_runningFunc(_event, _bot);
		}, 1000 * 60 * 60 * 24);
		// 設定今日或次日台灣時間 xx(24h):yy啟動第一次，接下來每天同時間啟動。
	}, _getTimeDifference_From_Now_To_SettingTime(parseInt(aryAlarmTime[0]), parseInt(aryAlarmTime[1]), 1, 0, _beginFrom, _consoleString2));
}

// 功能：輸入預定的時間，算出現時間跟預定時間的時間差。
// 參數：_hours, _mins, _secs, _msecs 表示時、分、秒、微秒。
//     輸入時間為 台灣時間。(內部自動會轉 UTC)
//     _today_or_tomorrow ： TODAY (今天)，TOMORROW(明天), 設定第一次啟動今天或明天
//     _extra_string：額外要被console印出的訊息文字
// 回傳：回傳時間差，ms
function _getTimeDifference_From_Now_To_SettingTime(_hours, _mins, _secs, _msecs, _today_or_tomorrow, _extra_string) {
	let settingDateTime = new Date();	// 取得今日日期與現在時間
	if (_hours >= 8) {	// 設定台灣時間如果大於等於8點，就用明天的設定時間減8小時
		settingDateTime.setDate(settingDateTime.getDate() + _today_or_tomorrow);
		settingDateTime.setHours(_hours - 8, _mins, _secs, _msecs);
	} else {			// 設定台灣時間如果小於8點，就用今天的設定時間加16小時
		settingDateTime.setHours(_hours + 16, _mins, _secs, _msecs);
	}
	//console.log(settingDateTime + '----' + settingDateTime.getTime());
	let nowDateTime = new Date();
	let timeDifference = settingDateTime.getTime() - nowDateTime.getTime();

	fmlog('sys_msg', [s.sch_schedling,
		settingDateTime + '---【TDiff = ' + timeDifference + '】---' + _extra_string]);
	return timeDifference;
}

//////////////  Module Exports //////////////////
module.exports = {
	setCyclicTimer_Do_Everyday : _setCyclicTimer_Do_Everyday
};