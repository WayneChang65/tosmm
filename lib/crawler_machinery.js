'use strict';
const puppeteer = require('puppeteer');
const os = require('os');

let browser;
let page;
let this_os = '';
let stopSelector = '.content .list-box .txt-list > li > a';
let userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3723.0 Safari/537.36';

async function _initialize() {
	this_os = os.platform();
	browser = (this_os === 'linux') ?
		await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] }) :
		await puppeteer.launch({ headless: false });

	/***** 建立Browser上的 newPage *****/
	page = await browser.newPage();
	page.setUserAgent(userAgent);
}

async function _getResults() {
	let data_pages = [];
	const machineryUrl = 'http://www.smartmachinery.tw/page/news/index.aspx?kind=8';
	try {
		await page.goto(machineryUrl);
		await page.waitForSelector(stopSelector);
		data_pages.push(await page.evaluate(_scrapingOnePage));
	} catch(e) {
		console.log('<MAC> page.goto ERROR!' + e);
		browser.close();
	}
	
	/***** 將多頁資料 "照實際新舊順序" 合成 1 個物件 *****/
	return await _mergePages(data_pages);
}

async function _close() {
	if (browser) await browser.close();
}

function _scrapingOnePage() {
	let aryTitle = [], aryHref = [], aryDate = [];

	const titleSelectorAll = '.content .list-box .txt-list > li > a';
	
	let nlResultTitleAll = document.querySelectorAll(titleSelectorAll);
	let aryResultTitleAll = Array.from(nlResultTitleAll).map(xxx => xxx.innerText);
	let aryResultHrefAll = Array.from(nlResultTitleAll).map(xxx => xxx.href);
   
	for (let i = 0; i < aryResultTitleAll.length; i++) {
		if (i == 0) continue; // 因為 i = 0，是空的。這個網頁資料從1開始
		let strSplit = aryResultTitleAll[i].split('\n');
		aryDate.push(strSplit[1].trim());
		aryTitle.push(strSplit[0].trim());

		aryHref.push(aryResultHrefAll[i]);
	}
	return ({ aryDate, aryTitle, aryHref });
}

function _mergePages(pages) {
	return new Promise((resolve/*, reject*/) => {
		let aryAllPagesTitle = [],
			aryAllPagesUrl = [],
			aryAllPagesDate = [];
			
		for (let i = 0; i < pages.length; i++) {
			for (let j = 0; j < pages[i].aryTitle.length; j++) {
				aryAllPagesTitle.push(pages[i].aryTitle[j]);
				aryAllPagesUrl.push(pages[i].aryHref[j]);
				aryAllPagesDate.push(pages[i].aryDate[j]);
			}
		}
		let dates = aryAllPagesDate;
		let titles = aryAllPagesTitle;
		let urls = aryAllPagesUrl;

		resolve({
			dates,
			titles,
			urls
		});
	});
}

module.exports = {
	initialize: _initialize,
	getResults: _getResults,
	close: _close
};