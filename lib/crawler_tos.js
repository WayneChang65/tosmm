'use strict';
const puppeteer = require('puppeteer');
const os = require('os');
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const isInsideDocker = require('./is-docker.js');

let browser = null;
let page = null;
let this_os = '';
let stopSelector = '#main-content';
let userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3723.0 Safari/537.36';

async function _initialize() {
	const chromiumExecutablePath = (isInsideDocker()) 
		? '/usr/bin/chromium' : '/usr/bin/chromium-browser';

	this_os = os.platform();
	fmlog('event_msg', ['TOS-CRAWLER', 'The OS is ' + this_os, 
		isInsideDocker() ? '[ Inside a container ]' : '[ Not inside a container ]']);

	browser =
		(this_os === 'linux')
			? await puppeteer.launch({
				headless: 'new',
				executablePath: chromiumExecutablePath,
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			})
			: await puppeteer.launch({ headless: false });

	/***** 建立Browser上的 newPage *****/
	page = await browser.newPage();
	page.setUserAgent(userAgent);
}

async function _getResults() {
	let data_pages = [];
	let content;
	let aryContent;
	let aryRetVal = [];
	const tosUrl = 'https://towerofsaviors.com/category/%E5%85%AC%E5%91%8A/';
	try {
		await page.goto(tosUrl);
		await page.waitForSelector(stopSelector);
		data_pages.push(await page.evaluate(_scrapingOnePage));
	} catch(e) {
		console.log('<TOS> page.goto ERROR!' + e);
		browser.close();
	}

	// 每週活動
	try {
		for (let i = 0; i < data_pages[0].aryTitle.length; i++) {
			let titleString = data_pages[0].aryTitle[i];
			if (titleString.match('慶祝活動詳情') != null ||
				titleString.match('慶祝活動內容') != null
			) {
				let tosUrl = data_pages[0].aryHref[i];
				//console.log('Test for 每週活動---_aryAllPagesTitle[' + i + '] = ' + titleString + tosUrl);
				fmlog('basic_msg', [s.ct_weekact,'_aryAllPagesTitle[' + i + ']' , titleString, s.ct_checknew]);

				let contentSelector = '#site-content > main > div > article > section > div.the-content';
				await page.goto(tosUrl);
				await page.waitForSelector(contentSelector);
				content = await page.evaluate(_scrapingTosWeek);
				content[0] = content[0].replace(/\n\n/g, '\n'); // 將兩行換行改一行
				content[0] = content[0].replace(/★/g, '\n★');  // 將星號前面多加一個換行

				aryContent = content[0].split('★'); // 用星號將每一彈都切成字串陣列
				
				// 因為line的message字數太多的話，超過上限，就不給reply或push，
				// 所以要切成小段。但又不能切太小段，可能會超過一次傳送訊息數的上限。
				// 目前試出來4彈切1個訊息是最ok的。
				let divider = 4;
				let divPages = [];
				let tempString;
				for (let i = 1; i < aryContent.length; i += divider) {
					tempString = '';
					for (let j = 0; j < divider; j++) {
						if (aryContent[i + j]) {
							tempString = tempString + '★' + aryContent[i + j];
						}
					}
					divPages.push(tempString);
				}
				aryRetVal = divPages;
				//console.log(aryRetVal);
				break;  // 找到第一個 '慶祝活動詳情' 就是最新每週資訊，就跳出。
			}else{
				//console.log('data_pages[0].aryTitle[' + i + '] is not match [慶祝活動詳情]');
			}
		}
	} catch (e) {
		console.log('<TOS> date_pages[0] = null.  ERROR!' + e);
		browser.close();
	}

	/***** 將多頁資料 "照實際新舊順序" 合成 1 個物件 *****/
	return await _mergePages(data_pages, aryRetVal);
}


async function _close() {
	if (browser) await browser.close();
}

function _scrapingOnePage() {
	let aryTitle = [], aryHref = [], aryDate = [], aryType = [];

	const titleSelectorAll = '#main-content > article > section > h2 > a';
	let nlResultTitleAll = document.querySelectorAll(titleSelectorAll);
	let aryResultTitleAll = Array.from(nlResultTitleAll).map(xxx => xxx.innerText);
	let aryResultHrefAll = Array.from(nlResultTitleAll).map(xxx => xxx.href);

	const dateSelectorAll = '#main-content > article > section > div > span > a > time > span.post-human-time';
	let nlResultDateAll = document.querySelectorAll(dateSelectorAll);
	let aryResultDateAll = Array.from(nlResultDateAll).map(xxx => xxx.innerText);

	const typeSelectorAll = '#main-content > article > section > div > span.post-lead-category > a';
	let nlResultTypeAll = document.querySelectorAll(typeSelectorAll);
	let aryResultTypeAll = Array.from(nlResultTypeAll).map(xxx => xxx.innerText);

	aryTitle = aryResultTitleAll;
	aryHref = aryResultHrefAll;
	aryDate = aryResultDateAll;
	aryType = aryResultTypeAll;

	return ({ aryTitle, aryHref, aryDate, aryType });
}

function _scrapingTosWeek() {
	let contentSelector = '#site-content > main > div > article > section > div.the-content';
	let nlResultContent = document.querySelectorAll(contentSelector);
	let aryResultContent = Array.from(nlResultContent).map(xxx => xxx.innerText);

	return aryResultContent;
}

function _mergePages(pages, _weeks) {
	return new Promise((resolve/*, reject*/) => {
		let aryAllPagesTitle = [],
			aryAllPagesUrl = [],
			aryAllPagesDate = [],
			aryAllPagesType = [];
		

		for (let i = 0; i < pages.length; i++) {
			for (let j = 0; j < pages[i].aryTitle.length; j++) {
				aryAllPagesTitle.push(pages[i].aryTitle[j]);
				aryAllPagesUrl.push(pages[i].aryHref[j]);
				aryAllPagesDate.push(pages[i].aryDate[j]);
				aryAllPagesType.push(pages[i].aryType[j]);
			}
		}

		let titles = aryAllPagesTitle;
		let urls = aryAllPagesUrl;
		let dates = aryAllPagesDate;
		let types = aryAllPagesType;
		let weeks = _weeks;

		resolve({
			titles,
			urls,
			dates,
			types,
			weeks
		});
	});
}

module.exports = {
	initialize: _initialize,
	getResults: _getResults,
	close: _close
};