/* eslint-disable no-prototype-builtins */
'use strict';
const fs = require('fs');
const dateTime = require('node-datetime');
const { randomSync } = require('./secure-random.js');

/**
 * [自動將輸入的數字用0補足前面位數的函式]
 * @param       {[number]} num    [要補0的數字]
 * @param       {[number]} length [0加上去後的總位數]
 * @return      {[string]}        [補完0的數字]
 */
// 這裏length的引數，是包含num的位數。例如，想要00087的輸出，num要是87，length要給5，不是給 3！！！
function _numAddString0(num, length){
	for(let len = (num + '').length; len < length; len = num.length) {
		num = '0' + num;
	}
	return num;
}

/**
 * [刪除Serverl端，某目錄下的所有檔案]
 * 這會連同目錄一塊刪掉，要小心使用！！！！！
 * @param       {[type]} path [傳入要刪的檔案目錄路徑]
 * @return      {[type]}      [undefined]
 */
function _deleteall(path) {
	let files = [];
	if (fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function (file/*, index*/) {
			let curPath = path + '/' + file;
			if (fs.statSync(curPath).isDirectory()) { // recurse
				_deleteall(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
}

/**
 * [移除陣例裏面某一個元素]
 * 用法如下：
 * let ary = ['three', 'seven', 'eleven'];
 * removeA(ary, 'seven');
 * console.log(removeA(ary, 'seven')); // 印出['three', 'seven']
 *
 * @param       {[type]} arr [欲移除元素的陣列]
 * @return      {[type]}     [移除完的成的陣列]
 */
function _removeA(arr){
	let what, a = arguments, L = a.length, ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax= arr.indexOf(what)) !== -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}


// 統計字串陣列元素重覆的個數
function _countElmOfArray(ary) {
	//let origin = [1, 2, 'a', 3, 1, 'b', 'a'];
	let result = {};
	ary.forEach(function(item) {
		result[item] = result[item] ? result[item] + 1 : 1;
	});
	//console.log(Object.keys(result)); // ["1", "2", "3", "a", "b"]
	//console.log(result); // Object {1: 2, 2: 1, 3: 1, a: 2, b: 1}
	//console.log("result['1'] = " + result['1']);
	return result;
}


/**
 * [陣列洗牌]
 * @param       {[type]} ary [將被洗牌的陣列]
 * @return      {[type]}     [洗完牌的陣列]
 */
function _shuffle(ary){
	// for迴圈內
	// i : 將會從陣列的最後一個位置，慢慢往前移到第一個位置(但移到第一個位置時
	//     for迴圈不執行，因為Javascript的數值0也代表false，會離開迴圈。)
	// j : 將會被亂數選擇，選到要被交換的位置
	// x : 用來暫存o[i]的數值，幫助o[i]與o[j]做數值交換
	for (let j, x, i = ary.length; i;) {
		//j = Math.floor(Math.random() * i);
		j = Math.abs(randomSync(0, i));
		// javascript的array是0-base
		// 所以迴圈第一次進入，--i後表示陣列最後一個位置。
		x = ary[--i];
		ary[i] = ary[j];
		ary[j] = x;
		// 以上三行代表以x為temp, ary[i], ary[j]做交換
	}
	return ary;
}

/**
 * [依照輸入的上下限，取得上下限數字中間的任一亂數]
 * @param       {[type]} minNum [最小值]
 * @param       {[type]} maxNum [最大值]
 * @return      {[type]}        [最小與最大值中的任一亂數]
 */
function _getRandom(minNum, maxNum){
	//return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
	return randomSync(minNum, maxNum);
}

/**
 * [輸入mili second，傳回時分秒陣列]
 * @param       {[number]} _miliSec [int微秒]
 * @return      {[array]}           [時、分、秒，int 陣列]
 */
function _transMiliSecToHMS(_miliSec){
	let hms = [];
	let h = parseInt(_miliSec / (1000 * 60 * 60));
	_miliSec -= h * (1000 * 60 * 60);
	let m = parseInt(_miliSec / (1000 * 60));
	_miliSec -= m * (1000 * 60);
	let s = parseInt(_miliSec / 1000);
	if (h >= 24) h %= 24;
	hms.push(h); hms.push(m); hms.push(s);
	return hms;
}

// 取得現在時間
function _getCurrentDateTime(_shiftInDays) {
	// 本程式開始執行的時間
	let _dateTime;
	let gDt = dateTime.create();
	if (_isDST()) {
		gDt.offsetInHours(7);
	}else{
		gDt.offsetInHours(8);
	}
	dateTime.setShortWeekNames([
		'日', '一', '二', '三', '四', '五', '六'
	]);
	// 因為如果設定早上8點以前發訊，必須shift一天，日期才會對。時區問題。
	if (_shiftInDays) gDt.offsetInDays(_shiftInDays);
	_dateTime = gDt.format('Y/m/d (w) H:M:S');
	return _dateTime;
}

// 檢查是否為 夏季節約時間 (因為系統用英國時間，所以會用到)
function _isDST() {
	Date.prototype.stdTimezoneOffset = function () {
		let jan = new Date(this.getFullYear(), 0, 1);
		let jul = new Date(this.getFullYear(), 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	};
	Date.prototype.dst = function () {
		return this.getTimezoneOffset() < this.stdTimezoneOffset();
	};
	let today = new Date();
	return today.dst();
}

// 比較新舊兩個物件 Array，是否存在元素差異。
// Return: 回傳差異的新 Array 元素
// 注意：檢查傳入是否 Array型別，另外也檢查Array元素物件是否包含num, title, content以及href元素。
// { title: 'ttt', num: 999, href: 'https://xxx.xxx.xxx', content: '' };
function _checkNewItemFromArray(oldArray, newArray) {
	if (!Array.isArray(oldArray) || !Array.isArray(newArray)) {
		throw new Error('Argments should be arrays.');
	}
	oldArray.forEach(item => {
		if (!typeof item == 'object' ||
			!_checkOwnProperty(item, 'title') || !_checkOwnProperty(item, 'content') ||
			!_checkOwnProperty(item, 'href') || !_checkOwnProperty(item, 'num'))
			throw new Error('Structure of element of array is not completed.');
	});
	newArray.forEach(item => {
		if (!typeof item == 'object' ||
			!_checkOwnProperty(item, 'title') || !_checkOwnProperty(item, 'content') ||
			!_checkOwnProperty(item, 'href') || !_checkOwnProperty(item, 'num'))
			throw new Error('Structure of element of array is not completed.');
	});

	let tempNewArray = newArray;
	oldArray.forEach(oldItem => {
		tempNewArray = tempNewArray.filter(newItem => newItem.title !== oldItem.title);
	});
	return tempNewArray;
}

// 檢查obj物件是否有key這個property
// 如果單純用原生的hasOwnProperty，會有eslint的安全性問題。
function _checkOwnProperty(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key) ? true : false;
}

//////////////  Module Exports //////////////////
module.exports = {
	numAddString0 : _numAddString0,
	deleteall : _deleteall,
	removeA : _removeA,
	countElmOfArray : _countElmOfArray,
	shuffle : _shuffle,
	getRandom : _getRandom,
	transMiliSecToHMS : _transMiliSecToHMS,
	getCurrentDateTime : _getCurrentDateTime,
	isDST : _isDST,
	checkNewItemFromArray: _checkNewItemFromArray,
	checkOwnProperty: _checkOwnProperty
};

