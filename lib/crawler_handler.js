'use strict';
const usr_mgr = require('./usr_mgr.js').init();
const crawler = require('./crawler.js');
const basic_f = require('./basic_f.js');
const fmlog = require('@waynechang65/fml-consolelog').log;
const push2reply = require('./push2reply.js').init();
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const c = require('./const_def.js').init();

// 爬蟲存放最新的 1 筆帖子
let gCurrentCrawler_newestData = 
	{ ptt: '',	baha: '', tos: '', g8g: '', baha_ary: [], idb: '', sm: '' };
let crawlerObj = {};
let gCrawlerEnablePost = false;

async function _updateCrawlerInfo(_event, _bot) {
	// Debug的時候，縮短週期時間的一個除數(正常時候是 1, 測試的時候可以設 3，加速)
	let debug_shortenDurationMultiplier = 1;
	let groupDB = usr_mgr.getGDB();

	setInterval(async () => {
		let ptt = await crawler.pttCrawler();
		if (ptt.titles.length === 0) {
			fmlog('error_msg', [s.ch_ptt, s.ch_crawlererror, ' ']);
			return;
		}

		crawlerObj.ptt = ptt;
		let ptt_refresh = false;
		if (gCurrentCrawler_newestData.ptt != ptt.titles[0]){
			gCurrentCrawler_newestData.ptt = ptt.titles[0];
			if (gCurrentCrawler_newestData.ptt) {
				ptt_refresh = true;
				for (let i = 0; i < groupDB.length; i++){
					if (groupDB[i].is_alive === true && groupDB[i].sw_ptt === true && gCrawlerEnablePost == true){
						_bot.push(groupDB[i].gid, '\u{1F460}\u{1F460}【PTT】\u{1F460}\u{1F460}\n' + 
						ptt.titles[0] + '\n' + decodeURIComponent(ptt.urls[0]));
					}
					if (groupDB[i].is_alive === true && groupDB[i].p2r_sw.ptt === true && gCrawlerEnablePost == true){
						push2reply.add_aP2RMsg_to_aGroup('ptt', i,
							'\u{1F460}\u{1F460}【PTT】\u{1F460}\u{1F460}\n' +
							ptt.titles[0] + '\n' + decodeURIComponent(ptt.urls[0]));
					}
				}
				push2reply.save(groupDB);
			}
		}
		if (ptt_refresh) {
			fmlog('crawler_msg', [s.ch_refresh, s.ch_ptt,
				ptt.titles[0], ptt.titles.length, basic_f.getCurrentDateTime()]);
		} else {
			fmlog('crawler_msg', [s.ch_nocmd, s.ch_ptt,
				'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);
		}
	}, 1000 * 60 * 10 / debug_shortenDurationMultiplier);	// 10分鐘

	setTimeout(() => {
		setInterval(async () => {
			let baha = await crawler.bahaCrawler();
			if (baha.titles.length === 0) {
				fmlog('error_msg', [s.ch_baha, s.ch_crawlererror, ' ']);
				return;
			}

			crawlerObj.baha = baha;
			let baha_refresh = gCurrentCrawler_newestData.baha_ary.includes(baha.titles[0]) ? false : true;
			
			gCurrentCrawler_newestData.baha_ary = baha.titles;

			if (baha_refresh){
				for (let i = 0; i < groupDB.length; i++){
					if (groupDB[i].is_alive === true && groupDB[i].sw_baha === true && gCrawlerEnablePost == true){
						_bot.push(groupDB[i].gid, '\u{1f409}\u{1f409}【巴哈】\u{1f409}\u{1f409}\n' +
						baha.titles[0] + '\n' + decodeURIComponent(baha.urls[0]));
					}
					if (groupDB[i].is_alive === true && groupDB[i].p2r_sw.baha === true && gCrawlerEnablePost == true){
						push2reply.add_aP2RMsg_to_aGroup('baha', i,
							'\u{1f409}\u{1f409}【巴哈】\u{1f409}\u{1f409}\n' +
							baha.titles[0] + '\n' + decodeURIComponent(baha.urls[0]));
					}
				}
				push2reply.save(groupDB);
			}
			if (baha_refresh) {
				fmlog('crawler_msg', [s.ch_refresh, s.ch_baha,
					baha.titles[0], baha.titles.length, basic_f.getCurrentDateTime()]);
			} else {
				fmlog('crawler_msg', [s.ch_nocmd, s.ch_baha,
					'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);
			}

		}, 1000 * 60 * 10 / debug_shortenDurationMultiplier);	// 10分鐘
	}, 1000 * 60 * 1 / debug_shortenDurationMultiplier);	// 第1分鐘

	setTimeout(() => {
		setInterval(async () => {
			let tos = await crawler.tosCrawler();
			if (tos.titles.length === 0) {
				fmlog('error_msg', [s.ch_tos, s.ch_crawlererror, ' ']);
				return;
			}

			crawlerObj.tos = tos;
			let tos_refresh = false;
			if (gCurrentCrawler_newestData.tos != tos.titles[0]){
				gCurrentCrawler_newestData.tos = tos.titles[0];
				if (gCurrentCrawler_newestData.tos) {
					tos_refresh = true;

					for (let i = 0; i < groupDB.length; i++){
						if (groupDB[i].is_alive === true && groupDB[i].sw_tos === true && gCrawlerEnablePost == true){
							_bot.push(groupDB[i].gid, '\u{1F525}\u{1F525}【官網】\u{1F525}\u{1F525}\n'
							+ tos.titles[0] + '\n' + decodeURIComponent(tos.urls[0]));
						}
						if (groupDB[i].is_alive === true && groupDB[i].p2r_sw.tos === true && gCrawlerEnablePost == true){
							push2reply.add_aP2RMsg_to_aGroup('tos', i,
								'\u{1F525}\u{1F525}【官網】\u{1F525}\u{1F525}\n' +
								tos.titles[0] + '\n' + decodeURIComponent(tos.urls[0]));
						}
					}
					push2reply.save(groupDB);
				}
			}
			//gCrawlerEnablePost = true;
			if (tos_refresh) {
				fmlog('crawler_msg', [s.ch_refresh, s.ch_tos,
					tos.titles[0], tos.titles.length, basic_f.getCurrentDateTime()]);
			} else {
				fmlog('crawler_msg', [s.ch_nocmd, s.ch_tos,
					'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);
			}

		}, 1000 * 60 * 10 / debug_shortenDurationMultiplier);	// 10分鐘
	}, 1000 * 60 * 2 / debug_shortenDurationMultiplier);	// 第2分鐘

	// g8game 網站目前有問題，已公告停止更新。因此這裏先mark掉
	// 等網站修好，再解掉mark即可。
	// 如果要恢復g8game功能，除了解掉以下mark之外，還要做一件很重要的事！
	// 就是把 上面 tos 那一行 gCrawlerEnablePost = true; 刪掉！
	// 這行的功能，就是要免除第一次程式啟動時，不要去post。如果這行沒清掉，g8g第一次載入就會post
	// 會造成舊資料再重覆post一次。
	/*
	setTimeout(() => {
		setInterval(async () => {
			let g8g = await crawler.g8gCrawler();
			crawlerObj.g8g = g8g;
			let g8g_refresh = false;
			if (gCurrentCrawler_newestData.g8g != g8g.titles[0]){
				gCurrentCrawler_newestData.g8g = g8g.titles[0];
				if (gCurrentCrawler_newestData.g8g) {
					g8g_refresh = true;

					for (let i = 0; i < groupDB.length; i++){
						if (groupDB[i].sw_g8g === true && gCrawlerEnablePost == true){
							_bot.push(groupDB[i].gid, '\u{3299}\u{3299}【G8GAME】\u{3299}\u{3299}\n' + 
							g8g.titles[0] + '\n' + decodeURIComponent(g8g.urls[0]));
						}
						if (groupDB[i].p2r_sw.g8g === true && gCrawlerEnablePost == true){
							push2reply.add_aP2RMsg_to_aGroup('g8g', i,
								'\u{3299}\u{3299}【G8GAME】\u{3299}\u{3299}\n' +
								g8g.titles[0] + '\n' + decodeURIComponent(g8g.urls[0]));
						}
					}
					push2reply.save(groupDB);
				}
			}
			gCrawlerEnablePost = true;
			if (g8g_refresh) {
				fmlog('crawler_msg', [s.ch_refresh, s.ch_g8g,
					g8g.titles[0], g8g.titles.length, basic_f.getCurrentDateTime()]);
			} else {
				fmlog('crawler_msg', [s.ch_nocmd, s.ch_g8g,
					'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);
			}

		}, 1000 * 60 * 5 / debug_shortenDurationMultiplier);	// 5分鐘
	}, 1000 * 60 * 3 / debug_shortenDurationMultiplier);	// 3分鐘
	*/

	/*
	setTimeout(() => {
		setInterval(async () => {
			let idb = await crawler.idbCrawler();
			if (idb.titles.length === 0) {
				fmlog('error_msg', [s.ch_idb, s.ch_crawlererror, ' ']);
				return;
			}
			crawlerObj.idb = idb;
			let idb_refresh = false;
			if ((gCurrentCrawler_newestData.idb != idb.titles[0]) && idb.titles[0]){
				idb_refresh = true;
				for (let i = 0; i < idb.titles.length; i++) {
					if ((gCurrentCrawler_newestData.idb != idb.titles[i]) && idb.titles[i]) {
						if (gCrawlerEnablePost == true){
							// 直接push到 TOSMM_IDB_PUSH_GIDX的環境變數群組中
							_bot.push(groupDB[parseInt(c.TOSMM_IDB_PUSH_GIDX)].gid, 
								'\u{2728}\u{2728}【產創】\u{2728}\u{2728}\n' + 
								idb.titles[i] + '\n' + decodeURIComponent(idb.urls[i]));
						}
					} else {
						break;
					}
				}
			}
			if (idb_refresh) {
				gCurrentCrawler_newestData.idb = idb.titles[0];
				fmlog('crawler_msg', [s.ch_refresh, s.ch_idb,
					idb.titles[0], idb.titles.length, basic_f.getCurrentDateTime()]);
			} else {
				fmlog('crawler_msg', [s.ch_nocmd, s.ch_idb,
					'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);
			}

		}, 1000 * 60 * 10 / debug_shortenDurationMultiplier);	// 10分鐘
	}, 1000 * 60 * 3 / debug_shortenDurationMultiplier);	// 第3分鐘
	*/

	// * ==== 工業局 IDB Crawler ====
	crawlerObj.idb =  await crawler.idbCrawler2();
	// for TEST
	//crawlerObj.idb[2] = { title: 'ttt', num: 999, href: 'https://xxx.xxx.xxx', content: '' };
	//crawlerObj.idb[4] = { title: 'kkk', num: 888, href: 'https://xxx.xxx.xxx', content: '' };
	// crawlerObj.idb[5] = { num: 888, href: 'https://xxx.xxx.xxx', content: '' };
	setInterval(async () => {
		try {
			const newIdb = await crawler.idbCrawler2();
			let aryNewMsgs = basic_f.checkNewItemFromArray(crawlerObj.idb, newIdb);
			if (aryNewMsgs.length !== 0) {
				crawlerObj.idb = newIdb;
				aryNewMsgs.forEach(async (item) => {
					const shortHref = await crawler.shortenURL(item.href);
					//_bot.push(groupDB[parseInt(c.TOSMM_IDB_PUSH_GIDX)].gid, 
					_bot.push('Cedb278e86630179f19a395f9f7984a62',
						'\u{2728}\u{2728}【工業局】\u{2728}\u{2728}\n' + 
						item.title + '\n' + decodeURIComponent(shortHref));
	
					const dispTitle = (item.title.length > 10) ? item.title.slice(0, 9) : item.title;
					fmlog('crawler_msg', [s.ch_refresh, s.ch_idb,
						dispTitle + '...', shortHref, basic_f.getCurrentDateTime()]);
				});
			} else {
				fmlog('crawler_msg', [s.ch_nocmd, s.ch_idb,
					'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);
			}
		} catch (err) {
			fmlog('error_msg', [s.ch_idb, s.ch_crawlererror, ' ']);
		}
	}, 1000 * 60 * 999 / debug_shortenDurationMultiplier);	// 10分鐘

	/*
	setTimeout(() => {
		setInterval(async () => {
			let machinery = await crawler.machineryCrawler();
			if (machinery.titles.length === 0) {
				fmlog('error_msg', [s.ch_machinery, s.ch_crawlererror, ' ']);
				return;
			}

			crawlerObj.machinery = machinery;
			let machinery_refresh = false;
			if ((gCurrentCrawler_newestData.machinery != machinery.titles[0]) && machinery.titles[0]){
				machinery_refresh = true;
				for (let i = 0; i < machinery.titles.length; i++) {
					if ((gCurrentCrawler_newestData.machinery != machinery.titles[i]) && machinery.titles[i]) {
						if (gCrawlerEnablePost == true){
							// 直接push到 TOSMM_IDB_PUSH_GIDX的環境變數群組中
							_bot.push(groupDB[parseInt(c.TOSMM_IDB_PUSH_GIDX)].gid, 
								'\u{1F506}\u{1F506}【智機辦】\u{1F506}\u{1F506}\n' + 
								machinery.titles[i] + '\n' + decodeURIComponent(machinery.urls[i]));
						}
					} else {
						break;
					}
				}
			}
			if (machinery_refresh) {
				gCurrentCrawler_newestData.machinery = machinery.titles[0];
				fmlog('crawler_msg', [s.ch_refresh, s.ch_machinery,
					machinery.titles[0], machinery.titles.length, basic_f.getCurrentDateTime()]);
			} else {
				fmlog('crawler_msg', [s.ch_nocmd, s.ch_machinery,
					'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);
			}
			// 這行的功能，就是要免除第一次程式啟動時，不要去post。
			// 要放在最後一個 setTimeout裏。
			gCrawlerEnablePost = true;

		}, 1000 * 60 * 10 / debug_shortenDurationMultiplier);	// 10分鐘
	}, 1000 * 60 * 4 / debug_shortenDurationMultiplier);	// 第4分鐘
*/

	// * ==== 智機辦 SM Crawler ====
	crawlerObj.sm =  await crawler.smCrawler2();
	setInterval(async () => {
		try {
			const newSm = await crawler.smCrawler2();
			let aryNewMsgs = basic_f.checkNewItemFromArray(crawlerObj.sm, newSm);
			if (aryNewMsgs.length !== 0) {
				crawlerObj.sm = newSm;
				aryNewMsgs.forEach(async (item) => {
					const shortHref = await crawler.shortenURL(item.href);
					//_bot.push(groupDB[parseInt(c.TOSMM_IDB_PUSH_GIDX)].gid, 
					_bot.push('Cedb278e86630179f19a395f9f7984a62',
						'\u{2728}\u{2728}【智機辦】\u{2728}\u{2728}\n' + 
						item.title + '\n' + decodeURIComponent(shortHref));
					
					const dispTitle = (item.title.length > 10) ? item.title.slice(0, 9) : item.title;
					fmlog('crawler_msg', [s.ch_refresh, s.ch_sm,
						dispTitle + '...', shortHref, basic_f.getCurrentDateTime()]);
				});
			} else {
				fmlog('crawler_msg', [s.ch_nocmd, s.ch_sm,
					'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);	
			}
		} catch (err) {
			fmlog('error_msg', [s.ch_sm, s.ch_crawlererror, ' ']);
		}
	}, 1000 * 60 * 999 / debug_shortenDurationMultiplier);	// 10分鐘

	// * ==== 精機中心 PMC Crawler ====
	crawlerObj.pmc =  await crawler.pmcCrawler();
	setInterval(async () => {
		try {
			const newPmc = await crawler.pmcCrawler();
			let aryNewMsgs = basic_f.checkNewItemFromArray(crawlerObj.pmc, newPmc);
			if (aryNewMsgs.length !== 0) {
				crawlerObj.pmc = newPmc;
				aryNewMsgs.forEach(async (item) => {
					const shortHref = await crawler.shortenURL(item.href);
					//_bot.push(groupDB[parseInt(c.TOSMM_IDB_PUSH_GIDX)].gid, 
					_bot.push('Cedb278e86630179f19a395f9f7984a62',
						'\u{2728}\u{2728}【精機中心】\u{2728}\u{2728}\n' + 
						item.title + '\n' + decodeURIComponent(shortHref));

					const dispTitle = (item.title.length > 10) ? item.title.slice(0, 9) : item.title;
					fmlog('crawler_msg', [s.ch_refresh, s.ch_pmc,
						dispTitle + '...', shortHref, basic_f.getCurrentDateTime()]);
				});
			} else {
				fmlog('crawler_msg', [s.ch_nocmd, s.ch_pmc,
					'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);	
			}
		} catch (err) {
			fmlog('error_msg', [s.ch_pmc, s.ch_crawlererror, ' ']);
		}
	}, 1000 * 60 * 999 / debug_shortenDurationMultiplier);	// 10分鐘

	// * ==== 零組件公會 TMBA Crawler ====
	crawlerObj.tmba =  await crawler.tmbaCrawler();
	setInterval(async () => {
		try {
			const newTmba = await crawler.tmbaCrawler();
			let aryNewMsgs = basic_f.checkNewItemFromArray(crawlerObj.tmba, newTmba);
			if (aryNewMsgs.length !== 0) {
				crawlerObj.tmba = newTmba;
				aryNewMsgs.forEach(async (item) => {
					const shortHref = await crawler.shortenURL(item.href);
					//_bot.push(groupDB[parseInt(c.TOSMM_IDB_PUSH_GIDX)].gid, 
					_bot.push('Cedb278e86630179f19a395f9f7984a62',
						'\u{2728}\u{2728}【零組件公會】\u{2728}\u{2728}\n' + 
						item.title + '\n' + decodeURIComponent(shortHref));

					const dispTitle = (item.title.length > 10) ? item.title.slice(0, 9) : item.title;
					fmlog('crawler_msg', [s.ch_refresh, s.ch_tmba,
						dispTitle + '...', shortHref, basic_f.getCurrentDateTime()]);
				});
			} else {
				fmlog('crawler_msg', [s.ch_nocmd, s.ch_tmba,
					'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);	
			}
		} catch (err) {
			fmlog('error_msg', [s.ch_tmba, s.ch_crawlererror, ' ']);
		}
	}, 1000 * 60 * 999 / debug_shortenDurationMultiplier);	// 10分鐘		
}

function _getCrawlerData(_which_web) {
	const maxShowLines = 5;
	let webData = crawlerObj[_which_web];
	let outString = '';
	if (webData) {
		let showLines = (webData.titles.length > maxShowLines) ? maxShowLines : webData.titles.length;
		for (let i = 0; i < showLines; i++) {
			//outString += webData.titles[i] + ' - ' + decodeURIComponent(webData.urls[i]) + '\n';
			outString += webData.titles[i] + '\n' + webData.urls[i] + '\n';
		}
	}
	return outString;
}

function _getCrawlerObj() {
	return crawlerObj;
}

//////////////  Module Exports //////////////////
module.exports = {
	go : _updateCrawlerInfo,
	getCrawlerData : _getCrawlerData,
	getCrawlerObj : _getCrawlerObj
};