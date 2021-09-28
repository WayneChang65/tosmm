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
const flex_crawler = require('./flex_crawler.js');

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
			gCrawlerEnablePost = true;	// 要加在最後一個puppteer的timer。初始化load資料，不做新資料判斷的flag
			if (tos_refresh) {
				fmlog('crawler_msg', [s.ch_refresh, s.ch_tos,
					tos.titles[0], tos.titles.length, basic_f.getCurrentDateTime()]);
			} else {
				fmlog('crawler_msg', [s.ch_nocmd, s.ch_tos,
					'-'.repeat(26), ' ', basic_f.getCurrentDateTime()]);
			}

		}, 1000 * 60 * 10 / debug_shortenDurationMultiplier);	// 10分鐘
	}, 1000 * 60 * 2 / debug_shortenDurationMultiplier);	// 第2分鐘

	// * ==== 工業局 IDB Crawler ====
	crawlerObj.idb =  await crawler.idbCrawler();
	fmlog('sys_msg', [s.ch_idb, s.ch_init]);
	// for TEST
	//crawlerObj.idb[2] = { title: 'ttt', num: 999, href: 'https://xxx.xxx.xxx', content: '' };
	//crawlerObj.idb[4] = { title: 'kkk', num: 888, href: 'https://xxx.xxx.xxx', content: '' };
	//crawlerObj.idb[5] = { num: 888, href: 'https://xxx.xxx.xxx', content: '' };
	setInterval(async () => {
		try {
			const newIdb = await crawler.idbCrawler();
			let aryNewMsgs = basic_f.checkNewItemFromArray(crawlerObj.idb, newIdb);
			if (aryNewMsgs.length !== 0) {
				crawlerObj.idb = newIdb;
				aryNewMsgs.forEach(async (item) => {
					const shortHref = await crawler.shortenURL(item.href);
					//_bot.push('Cedb278e86630179f19a395f9f7984a62',
					_bot.push(groupDB[parseInt(c.TOSMM_IDB_PUSH_GIDX)].gid,
						flex_crawler.msg(item.title, decodeURIComponent(shortHref), 'IDB'));
	
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
	}, 1000 * 60 * 30 / debug_shortenDurationMultiplier);	// 30分鐘

	// * ==== 智機辦 SM Crawler ====
	crawlerObj.sm =  await crawler.smCrawler();
	fmlog('sys_msg', [s.ch_sm, s.ch_init]);
	setInterval(async () => {
		try {
			const newSm = await crawler.smCrawler();
			let aryNewMsgs = basic_f.checkNewItemFromArray(crawlerObj.sm, newSm);
			if (aryNewMsgs.length !== 0) {
				crawlerObj.sm = newSm;
				aryNewMsgs.forEach(async (item) => {
					const shortHref = await crawler.shortenURL(item.href);
					//_bot.push('Cedb278e86630179f19a395f9f7984a62',
					_bot.push(groupDB[parseInt(c.TOSMM_IDB_PUSH_GIDX)].gid,
						flex_crawler.msg(item.title, decodeURIComponent(shortHref), 'SM'));
					
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
	}, 1000 * 60 * 30 / debug_shortenDurationMultiplier);	// 30分鐘

	// * ==== 精機中心 PMC Crawler ====
	crawlerObj.pmc =  await crawler.pmcCrawler();
	fmlog('sys_msg', [s.ch_pmc, s.ch_init]);
	setInterval(async () => {
		try {
			const newPmc = await crawler.pmcCrawler();
			let aryNewMsgs = basic_f.checkNewItemFromArray(crawlerObj.pmc, newPmc);
			if (aryNewMsgs.length !== 0) {
				crawlerObj.pmc = newPmc;
				aryNewMsgs.forEach(async (item) => {
					const shortHref = await crawler.shortenURL(item.href);
					//_bot.push('Cedb278e86630179f19a395f9f7984a62',
					_bot.push(groupDB[parseInt(c.TOSMM_IDB_PUSH_GIDX)].gid,
						flex_crawler.msg(item.title, decodeURIComponent(shortHref), 'PMC'));

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
	}, 1000 * 60 * 30 / debug_shortenDurationMultiplier);	// 30分鐘

	// * ==== 零組件公會 TMBA Crawler ====
	crawlerObj.tmba =  await crawler.tmbaCrawler();
	fmlog('sys_msg', [s.ch_tmba, s.ch_init]);
	setInterval(async () => {
		try {
			const newTmba = await crawler.tmbaCrawler();
			let aryNewMsgs = basic_f.checkNewItemFromArray(crawlerObj.tmba, newTmba);
			if (aryNewMsgs.length !== 0) {
				crawlerObj.tmba = newTmba;
				aryNewMsgs.forEach(async (item) => {
					const shortHref = await crawler.shortenURL(item.href);
					//_bot.push('Cedb278e86630179f19a395f9f7984a62',
					_bot.push(groupDB[parseInt(c.TOSMM_IDB_PUSH_GIDX)].gid,
						flex_crawler.msg(item.title, decodeURIComponent(shortHref), 'TMBA'));

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
	}, 1000 * 60 * 30 / debug_shortenDurationMultiplier);	// 30分鐘
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