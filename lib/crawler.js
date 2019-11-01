'use strict';
const unlimited_bitly = require('@waynechang65/unlimited-bitly');
const ptt_crawler = require('@waynechang65/ptt-crawler');
const baha_crawler = require('@waynechang65/baha-crawler');
const tos_crawler = require('./crawler_tos.js');
const g8g_crawler = require('./crawler_g8g.js');
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const c = require('./const_def.js').init();

// bitly 短網址
//const { BitlyClient } = require('bitly');
//const bitly = new BitlyClient(c.TOSMM_BITLY_KEY, {});		// wayne65
//const bitly_1 = new BitlyClient(c.TOSMM_BITLY_1_KEY, {});	// wayne65a1
//const bitly_2 = new BitlyClient(c.TOSMM_BITLY_2_KEY, {});	// wayne65a2
//const bitly_3 = new BitlyClient(c.TOSMM_BITLY_3_KEY, {});	// wayne65a3
//const bitly_4 = new BitlyClient(c.TOSMM_BITLY_4_KEY, {});	// wayne65a4

const BITLY_KEYS = [
	c.TOSMM_BITLY_KEY,
	c.TOSMM_BITLY_1_KEY,
	c.TOSMM_BITLY_2_KEY,
	c.TOSMM_BITLY_3_KEY,
	c.TOSMM_BITLY_4_KEY
];
const ubitly = unlimited_bitly.init(BITLY_KEYS);

async function shortenURL_forArray(_urlArray) {
	let shortURL = [];
	let result;
	if (!_urlArray) return;
	for (let i = 0; i < _urlArray.length; i++){
		try {
			result = await ubitly.shorten(_urlArray[i]);
			shortURL.push(result);
		} catch(e) {
			fmlog('error_msg', [s.crl_bitly, s.crl_bitlyerror, s.crl_bitlylimited]);
			// 當縮網址發生問題時，就以原來的長網址填入。
			// 基本上會發生這樣的問題，就是bitly帳號的額度不足了，要加帳號/額度。
			// 或是網站掛掉(機率相對低)，就會發生。
			//shortURL.push(_urlArray[i]);
			//throw e;
			shortURL = _urlArray;   // 回傳未縮短網址的URL
			break;                  // 有問題就直接跳出，不接著做 for 裏面的東西。
		}
	}
	//console.log(shortURL);
	return shortURL;
}
/*
async function shortenURL_forArray(_urlArray, _bitlyAccount) {
	let shortURL = [];
	let result;
	if (!_urlArray) return;
	for (let i = 0; i < _urlArray.length; i++){
		try {
			switch (_bitlyAccount) {
			case 1:
				result = await bitly_1.shorten(_urlArray[i]);
				break;
			case 2:
				result = await bitly_2.shorten(_urlArray[i]);
				break;
			case 3:
				result = await bitly_3.shorten(_urlArray[i]);
				break;
			case 4:
				result = await bitly_4.shorten(_urlArray[i]);
				break;
			default:
				result = await bitly.shorten(_urlArray[i]);
				break;
			}
			shortURL.push(result.url);
		} catch(e) {
			fmlog('error_msg', [s.crl_bitly, s.crl_bitlyerror, s.crl_bitlylimited]);
			// 當縮網址發生問題時，就以原來的長網址填入。
			// 我比較擔心的是，超過bitly每個月 1000短網址的限制到了，
			// 或是網站掛掉(機率相對低)，就會發生。
			//shortURL.push(_urlArray[i]);
			//throw e;
			shortURL = _urlArray;   // 回傳未縮短網址的URL
			break;                  // 有問題就直接跳出，不接著做 for 裏面的東西。
		}
	}
	//console.log(shortURL);
	return shortURL;
}
*/
async function _pttCrawler() {
	await ptt_crawler.initialize();
	let ptt = await ptt_crawler.getResults({
		board: 'ToS',
		pages: 2,
		skipPBs: true
	}); // ToS版，爬2頁，去掉置底文
	
	await ptt_crawler.close();
	ptt.urls = await shortenURL_forArray(ptt.urls);
	return ptt;
}

async function _bahaCrawler() {
	await baha_crawler.initialize();
	let baha = await baha_crawler.getResults({
		board: '23805',
		pages: 1,
		skipTPs: true
	}); // ToS版(23805), 爬 3頁, 去掉置頂文
	await baha_crawler.close();
	baha.urls = await shortenURL_forArray(baha.urls);
	return baha;
}

async function _tosCrawler() {
	await tos_crawler.initialize();
	let tos = await tos_crawler.getResults();
	await tos_crawler.close();
	tos.urls = await shortenURL_forArray(tos.urls);
	return tos;
}

async function _g8gCrawler() {
	await g8g_crawler.initialize();
	let g8g = await g8g_crawler.getResults();
	await g8g_crawler.close();
	g8g.urls = await shortenURL_forArray(g8g.urls);
	return g8g;
}

async function _getAccountsStatus() {
	return await ubitly.getAccountsStatus();
}
//////////////  Module Exports //////////////////
module.exports = {
	pttCrawler : _pttCrawler,
	bahaCrawler : _bahaCrawler,
	tosCrawler : _tosCrawler,
	g8gCrawler : _g8gCrawler,
	getAccountsStatus : _getAccountsStatus
};
