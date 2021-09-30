'use strict';
const nc = require('nanocolors');

// * 1. 先把 tosmm.js的 bot.on('join'...)訊息給註解掉
// * 2. 把_check的console.log(_event)打開。
// * 3. 啟動tosmm，將tosmm加入群組，隨便輸入一個文字以取得GID
// * 4. catch GID之後，退出 tosmm.
// * 5. 將GID加入下方 GID_SKIP_TOSMM 陣列
// * 6. 將tosmm.js的 bot.on('join'...)訊息被註解還原

const GID_SKIP_TOSMM = [
	'?????????????????????????????????',
	//'Cedb278e86630179f19a395f9f7984a62', 	// 火妍測試群
	//'Cf30a163d900ea30309e10222eebf5082', 	// 水妍測試群
	'Cecad5f111257f5abf00c0667a0528be7', 	// D300 Leader群
];
const bold = nc.bold;
const yellow = nc.yellow;

function _check(_event) {
	//console.log(_event);
	if (!_event || _event.source || !_event.message) return false;
	let gID = _event.source.groupId;
	let msg = _event.message.text;
	if (GID_SKIP_TOSMM.includes(gID)) {
		console.log(bold(yellow('tosmm_skip.check(): true --- ')) + yellow(msg));
		return true;
	} else {
		return false;
	}
}

function _getSkipTosmmGids() {
	return GID_SKIP_TOSMM;
}
//////////////  Module Exports //////////////////
module.exports = {
	check : _check,
	getSkipTosmmGids : _getSkipTosmmGids
};