'use strict';
const basic_f = require('./basic_f.js');
const fmlog = require('@waynechang65/fml-consolelog').log;
const usr_mgr = require('./usr_mgr.js').init();
const gm = require('gm');
const t_other = require('./toro_other.js');
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const c = require('./const_def.js').init();
const picTOS = [];
const CHANCE_NOT_DOUBLE = false;

// !★ chance不能是有 0 的項目，如果 0 要mark掉。
// 【 機率正常卡 】
//★ 卡片數量不固定，稀有數也不固定。ensure是保底數。
//   但RARE 卡，一定要放前面，不能跟 NORMAL混雜，否則會出錯
const CARDS = [	// chance:機率，單位 0.1%, type:大獎卡，小獎卡
	{ chance:    8,  type: 'RARE',  ensure: 40 },
	{ chance:   45,  type: 'RARE',  ensure: 0 },
	{ chance:   45,  type: 'RARE',  ensure: 0 },
	{ chance:  225, type: 'NORMAL', ensure: 0 },
	{ chance:  226, type: 'NORMAL', ensure: 0 },
	{ chance:  225, type: 'NORMAL', ensure: 0 },
	{ chance:  226, type: 'NORMAL', ensure: 0 },
//	{ chance:  150, type: 'NORMAL', ensure: 0 },
//	{ chance:  150, type: 'NORMAL', ensure: 0 },
//	{ chance:    0, type: 'NORMAL', ensure: 0 },
//	{ chance:    0, type: 'NORMAL', ensure: 0 },
//	{ chance:    0, type: 'NORMAL', ensure: 0 },
//	{ chance:    0, type: 'NORMAL', ensure: 0 },
//	{ chance:    0, type: 'NORMAL', ensure: 0 },
];

// 【 機率加倍卡 】 嶄新時代抽卡，不加倍
//★ 卡片數量不固定，稀有數也不固定。ensure是保底數。
//   但RARE 卡，一定要放前面，不能跟 NORMAL混雜，否則會出錯
const CARDS_DOUBLE = [
	{ chance:  10, type: 'RARE',   ensure: 40 },
	{ chance: 100, type: 'RARE',   ensure: 0 },
	{ chance: 100, type: 'RARE',   ensure: 0 },
	{ chance: 197, type: 'NORMAL', ensure: 0 },
	{ chance: 198, type: 'NORMAL', ensure: 0 },
	{ chance: 197, type: 'NORMAL', ensure: 0 },
	{ chance: 198, type: 'NORMAL', ensure: 0 },
//	{ chance: 130, type: 'NORMAL', ensure: 0 },
//	{ chance: 130, type: 'NORMAL', ensure: 0 },
//	{ chance:   0, type: 'NORMAL', ensure: 0 },
//	{ chance:   0, type: 'NORMAL', ensure: 0 },
//	{ chance:   0, type: 'NORMAL', ensure: 0 },
//	{ chance:   0, type: 'NORMAL', ensure: 0 },
//	{ chance:   0, type: 'NORMAL', ensure: 0 },
];

let tos_series;

function _init(_tos_series) {
	let checkResult = checkChance1000(CARDS);
	let checkResult_d = checkChance1000(CARDS_DOUBLE);
	tos_series = _tos_series;

	if (!checkResult.is1000) {
		fmlog('error_msg', [s.ttos_error, s.ttos_ne1000, checkResult.totalChance]);
		return null;
	}
	if (!checkResult_d.is1000) {
		fmlog('error_msg', [s.ttos_error, s.ttos_dne1000, checkResult_d.totalChance]);
		return null;
	}
	for (let i = 0; i < CARDS.length; i++) {
		picTOS.push(
			c.TOSMM_TORO_PIC_PATH_TOS + _tos_series + '/' +
			basic_f.numAddString0(i + 1, 4).toString() + '.jpg'
		);
	}
	return this;
}

function _getCardByChance(cards) {
	const minNum = 0;
	const maxNum = 999;
	let cardsToBeFlat = [];

	cards.forEach((item, index) => {
		cardsToBeFlat = [(new Array(item.chance)).fill(index + 1), ...cardsToBeFlat];
	});
	cardsToBeFlat = cardsToBeFlat.flat();
	let cardsRandom = basic_f.shuffle(cardsToBeFlat);
	let randN = basic_f.getRandom(minNum, maxNum);
	return cardsRandom[randN];
}

function _toro_single(_event, _bot, _doubleChance = CHANCE_NOT_DOUBLE) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);

	let randN = (_doubleChance) ? _getCardByChance(CARDS_DOUBLE) : _getCardByChance(CARDS);
	let pic_address = picTOS[randN - 1];

	_bot.getGroupMemberProfile(gID, uID).then((profile) => {
		_event.reply({
			type: 'image',
			originalContentUrl: pic_address,
			previewImageUrl: pic_address })
			.then(() => {	
				fmlog('command_msg',
					['GN:' + groupDB[idx].gname, idx, msg,
						'No.' + randN.toString() + '/' +
						CARDS.length, profile.displayName, uID]);
			});
	});
}

function checkChance1000(cards) {
	let total = cards.reduce((accum, curr) => {
		return { chance: accum.chance + curr.chance };
	});
	return {
		is1000: (total.chance === 1000) ? true : false,
		totalChance: total.chance
	};
}

// 功能：TOS一次十抽機能，將十抽卡片合成一張卡片輸出，並且畫出邊框。
// 參數：_event，linebot的事件物件
//      _isChanceDouble：如果是CHANCE_NOT_DOUBLE代表沒加倍，CHANCE_DOUBLE代表加倍
// 回傳：回傳抽卡結果陣列
function _toro_10(_event, _bot, _doubleChance = CHANCE_NOT_DOUBLE) {
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);

	const lWidth = 3;	// 大獎邊框線寬
	const location_1stPic_Left = 140 - 110;	// 第一張圖左上角點座標的left
	const location_1stPic_Top = 170 - 150;	// 第一張圖左上角點座標的Top
	const pic2picSpan = 10;	// 圖跟圖之間的間距
	const picWidth = 80;	// 圖片寬度
	const picHight = 80;	// 圖片高度

	let toroResult_picPath = [];
	let toroResult = [];
	let i, j;

	for (i = 0; i < 10; i++) {
		if (_doubleChance) {
			toroResult.push(_getCardByChance(CARDS_DOUBLE));
		} else {
			toroResult.push(_getCardByChance(CARDS));
		}
		toroResult_picPath.push(
			c.TOSMM_TORO_PIC_PATH_LOCAL_RW + 'tos_img/' + tos_series + '/' + 
			basic_f.numAddString0(toroResult[i], 4).toString() + '.jpg'
		);
	}
	
	// 針對每一張圖對gm所下的指令，下一行是指令的範例，用string構成。
	// .draw('image Over 140, 170, 80, 80 '/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0001.jpg'')
	// 由於由string構成，所以全部十張圖的位置通通經計算轉string處理。
	let numOfCards = 10;
	let numOfColumns = 5;	// 一列有幾個圖，也就是說有幾個column的意思。
	let numOfRows = 2;
	let gmDrawCommand = new Array(numOfCards);
	for (i = 0; i < numOfRows; i++){
		for (j = 0; j < numOfColumns; j++){
			gmDrawCommand[numOfColumns * i + j] = 'image Over ' +
				(location_1stPic_Left + picWidth * j + pic2picSpan * j).toString() + ', ' +
				(location_1stPic_Top + picHight * i + pic2picSpan * i).toString() + ', ' +
				picWidth.toString() + ', ' +
				picHight.toString() + toroResult_picPath[numOfColumns * i + j];
		}
	}

	// 用gm模組開檔，以toroBK.jpg為背景，再將其他圖疊上去處理。
	let _gm = gm(c.TOSMM_TORO_PIC_PATH_LOCAL_RW + 'tos_img/bk/toroBK.jpg');

	// 畫大獎邊框
	// 分成上面五個跟下面五個圖來處理
	// drawRectangle指令其實是畫矩形。只是這裏利用先畫矩形，然後再用圖疊上去的方式，
	// 製造出邊框效果。
	for (i = 0; i < numOfRows; i++){
		for (j = 0; j < numOfColumns; j++){
			if (CARDS[toroResult[numOfColumns * i + j] - 1].type === 'RARE') {	
				_gm.fill('yellow')
					.stroke('#ffffff')
					.drawRectangle(location_1stPic_Left + (picWidth + pic2picSpan) * j - lWidth,
						location_1stPic_Top + (picWidth + pic2picSpan) * i - lWidth,
						location_1stPic_Left + (picWidth + pic2picSpan) * j + picWidth + lWidth,
						location_1stPic_Top + (picWidth + pic2picSpan) * i + picHight + lWidth);
			}
		}
	}

	for (i = 0; i < numOfCards; i++) {
		_gm.draw(gmDrawCommand[i]);
	}

	// ***** 因為line client端針對同一個URL，基本上只有第一次會載入，後面如果再送
	// 同樣的URL，就會用client端的memory載入而已。
	// 所以說，如果後台server更新圖片資料，用同一個URL，Line Client端是「不會更新」的。
	// 因此，這裏用一個小技巧，就是把圖檔檔名用亂數產生，這樣對Line Client端就會是不同
	// 的URL，當然也就能順利更新了。
	// ***** 只是temp目錄下的檔案會越來越多，在還沒有好的方式「自動刪」的情況下，
	// 要靠人工進server手動刪。不過，一張圖40K，1000張也才40MB，占空間不大。
	let minNum = 1;
	let maxNum = 1000000;
	let randN = basic_f.getRandom(minNum, maxNum);
	let toroFname = c.TOSMM_TORO_PIC_PATH_LOCAL_RW + 'tos_img/temp/' +
		randN.toString() + '.jpg';

	_gm.write(toroFname, function(err){
		if (err) {
			throw new Error(err);
		}
		let strPicAddress = c.TOSMM_TORO_PIC_PATH_TEMP + randN.toString() + '.jpg';

		_bot.getGroupMemberProfile(gID, uID).then((profile) => {
			_event.reply({
				type: 'image',
				originalContentUrl: strPicAddress,
				previewImageUrl: strPicAddress })
				.then(() => {	
					fmlog('command_msg',
						['GN:' + groupDB[idx].gname, idx, msg,
							toroResult, profile.displayName, uID]);
				});
		});
	});

	return toroResult;	// 將抽卡結果陣列傳出
	/*
		gm('/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/toroBK.jpg')
			.fill('white')
			.stroke('#ffffff')
			.drawRectangle(140 - lWidth, 170 - lWidth, 140 + 80 + lWidth, 170 + 80 + lWidth)
			.drawRectangle(410 - lWidth, 260 - lWidth, 410 + 80 + lWidth, 260 + 80 + lWidth)
			.draw('image Over 140, 170, 80, 80 "/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0001.jpg"')
			.draw('image Over 230, 170, 80, 80 "/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0002.jpg"')
			.draw('image Over 320, 170, 80, 80 "/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0003.jpg"')
			.draw('image Over 410, 170, 80, 80 "/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0004.jpg"')
			.draw('image Over 500, 170, 80, 80 "/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0005.jpg"')
			.draw('image Over 140, 260, 80, 80 "/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0001.jpg"')
			.draw('image Over 230, 260, 80, 80 "/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0002.jpg"')
			.draw('image Over 320, 260, 80, 80 "/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0003.jpg"')
			.draw('image Over 410, 260, 80, 80 "/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0006.jpg"')
			.draw('image Over 500, 260, 80, 80 "/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0007.jpg"')
			.write('/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/temp/test001.jpg', function(err){
				if (!err) console.log('Write file successfully.---test001.jpg');
			});
	*/
}

// 功能：TOS抽好抽滿機能，將N張抽滿抽卡片合成一張卡片輸出，並且畫出邊框。
// 參數：_event，linebot的事件物件
//      _isChanceDouble：如果是CHANCE_NOT_DOUBLE代表沒加倍，CHANCE_DOUBLE代表加倍
//      _version：抽卡保底機制的版本
//			1:每35抽送1張最大獎。
//			2:增加在35抽時，送一個素材。
//            可以利用一張重覆的2獎加上這個素材，換一張你還沒有抽到的2獎。
// 回傳：回傳抽卡結果陣列

function _toro_n(_event, _bot, _doubleChance = CHANCE_NOT_DOUBLE, _version = 1) {	
	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);

	let lWidth = 0;	// 大獎邊框線寬
	let location_1stPic_Left = 0;	// 第一張圖左上角點座標的left
	let location_1stPic_Top = 0;	// 第一張圖左上角點座標的Top
	let pic2picSpan = 0;	// 圖跟圖之間的間距
	let picWidth = 0;		// 圖片寬度
	let picHight = 0;		// 圖片高度
	let gmBK_fileName = '';	// 背景圖檔名

	let numOfCards = 0;		// 總共被抽了幾張卡
	let numOfColumns = 0;	// 一列有幾個圖，也就是說有幾個column的意思。
	let numOfRows = 0;		// 全部有幾列，row的意思。
	let gmDrawCommand;		// gm畫圖的command陣列。
	let numOfPrintedCards = 0;	// 目前被印出的圖數量，判斷要不要停印的基準

	let rareTotalCards = 0;	// 稀有卡的總數(三大獎總數)

	let toroResult = new Array(0);
	let i, j;
	let aryTestFinish = new Array(0);
	let total_toroN_cards = 0;
	let total_TosCards = CARDS.length;

	// 回傳第一個保底不等 0 的數。CARDS filter回傳的是陣列，所以取 0 位元素是物件
	const ensure = CARDS.filter(item => item.ensure > 0)[0].ensure;

	for (i = 0; i < total_TosCards; i++){
		aryTestFinish.push((i + 1).toString());
	}

	for (i = 0; i < 1000; i++) {
		total_toroN_cards = i;

		if (aryTestFinish.length == 0) break;
		
		if ((i + 1) % ensure == 0) {
			toroResult.push('1'); // 第一大獎， 每35抽保底
		} else {
			(_doubleChance === CHANCE_NOT_DOUBLE) ?
				toroResult.push(_getCardByChance(CARDS).toString()) :
				toroResult.push(_getCardByChance(CARDS_DOUBLE).toString());
		}
		
		aryTestFinish = basic_f.removeA(aryTestFinish, toroResult[i]);

		switch (_version) {
		case 1:		// 只有 35抽保底第一大獎
			break;
		case 2:		// 35抽保底第一大獎 + 35抽後，如果二獎有兩張以上，其中一張可以換另一張缺的二獎
			if ((i + 1) >= 35) {	// 35抽以後(包含第35抽)
				let countResult = basic_f.countElmOfArray(toroResult);	// 計算每張卡各重覆抽了幾張
				let getCards = Object.keys(countResult);	// 傳回抽了哪些卡的陣列(不重覆計算)
				if (!getCards.includes('2') || !getCards.includes('3')) {
					if(countResult['2'] >= 2){
						aryTestFinish = basic_f.removeA(aryTestFinish, '3');
					}else if(countResult['3'] >= 2){
						aryTestFinish = basic_f.removeA(aryTestFinish, '2');
					}
				}
			}
			break;
		default:
			break;
		}
	}

	let toroResult_picPath = [];
	for (i = 0; i < total_toroN_cards; i++){
		toroResult_picPath.push(
			c.TOSMM_TORO_PIC_PATH_LOCAL_RW + 'tos_img/' + tos_series + '/' + 
			basic_f.numAddString0(parseInt(toroResult[i]), 4).toString() + '.jpg'
		);
	}
	
	//console.log(toroResult_picPath);
	// 針對每一張圖對gm所下的指令，下一行是指令的範例，用string構成。
	// .draw('image Over 140, 170, 80, 80 "/usr/share/httpd/noindex/images/lb_images/tos_img/hunterXhunter/0001.jpg"')
	// 由於由string構成，所以全部十張圖的位置通通經計算轉string處理。

	if (total_toroN_cards <= 10){
		// 10抽以內 toroBK_20_40.jpg
		lWidth = 3;
		location_1stPic_Left = 30;
		location_1stPic_Top = 20;
		pic2picSpan = 10;
		picWidth = 80;
		picHight = 80;

		numOfColumns = 5;

		gmBK_fileName = c.TOSMM_TORO_PIC_PATH_LOCAL_RW + 'tos_img/bk/toroBK_20_40.jpg';
	}else if (total_toroN_cards <= 40){
		// 40抽以內 toroBK_20_40.jpg
		lWidth = 3;
		location_1stPic_Left = 30;
		location_1stPic_Top = 20;
		pic2picSpan = 5;
		picWidth = 40 ;
		picHight = 40;

		numOfColumns = 10;

		gmBK_fileName = c.TOSMM_TORO_PIC_PATH_LOCAL_RW + 'tos_img/bk/toroBK_20_40.jpg';
	}else if (total_toroN_cards <= 80){
		// 80抽以內 toroBK_80.jpg
		lWidth = 3;
		location_1stPic_Left = 30 + 15;
		location_1stPic_Top = 20;
		pic2picSpan = 5;
		picWidth = 35 ;
		picHight = 35;

		numOfColumns = 10;

		gmBK_fileName = c.TOSMM_TORO_PIC_PATH_LOCAL_RW + 'tos_img/bk/toroBK_80.jpg';
	}else if (total_toroN_cards <= 150){
		// 160抽以內 toroBK_160.jpg
		lWidth = 3;
		location_1stPic_Left = 30;
		location_1stPic_Top = 20 - 8;
		pic2picSpan = 5;
		picWidth = 40 ;
		picHight = 40;

		numOfColumns = 10;

		gmBK_fileName = c.TOSMM_TORO_PIC_PATH_LOCAL_RW + 'tos_img/bk/toroBK_160.jpg';
	}else{
		// 150抽以上
		lWidth = 3;
		location_1stPic_Left = 30;
		location_1stPic_Top = 20 - 8;
		pic2picSpan = 5;
		picWidth = 40 ;
		picHight = 40;

		numOfColumns = 10;

		gmBK_fileName = c.TOSMM_TORO_PIC_PATH_LOCAL_RW + 'tos_img/bk/toroBK_160.jpg';
	}

	// 用gm模組開檔，以toroBK.jpg為背景，再將其他圖疊上去處理。
	let _gm = gm(gmBK_fileName);

	// 針對每張圖產生gm繪圖的指令
	numOfCards = total_toroN_cards;
	numOfRows = Math.floor(total_toroN_cards / 2) + 1;
	gmDrawCommand = new Array(numOfCards);
	numOfPrintedCards = 0;
	for (i = 0; i < numOfRows; i++){
		for (j = 0; j < numOfColumns; j++){
			numOfPrintedCards++;
			if (numOfPrintedCards > numOfCards) break;
			gmDrawCommand[numOfColumns * i + j] = 'image Over ' +
				(location_1stPic_Left + picWidth * j + pic2picSpan * j).toString() + ', ' +
				(location_1stPic_Top + picHight * i + pic2picSpan * i).toString() + ', ' +
				picWidth.toString() + ', ' +
				picHight.toString() + toroResult_picPath[numOfColumns * i + j];
		}
	}

	// 畫大獎邊框
	// 分成上面五個跟下面五個圖來處理
	// drawRectangle指令其實是畫矩形。只是這裏利用先畫矩形，然後再用圖疊上去的方式，
	// 製造出邊框效果。
	numOfPrintedCards = 0;
	for (i = 0; i < numOfRows; i++){
		for (j = 0; j < numOfColumns; j++){
			numOfPrintedCards++;
			if (numOfPrintedCards > numOfCards) break;
			if (CARDS[toroResult[numOfColumns * i + j] - 1].type === 'RARE') {
				_gm.fill('yellow')
					.stroke('#ffffff')
					.drawRectangle(location_1stPic_Left + (picWidth + pic2picSpan) * j - lWidth,
						location_1stPic_Top + (picWidth + pic2picSpan) * i - lWidth,
						location_1stPic_Left + (picWidth + pic2picSpan) * j + picWidth + lWidth,
						location_1stPic_Top + (picWidth + pic2picSpan) * i + picHight + lWidth);
				rareTotalCards++;
			}
		}
	}
	for (i = 0; i < numOfCards; i++){
		_gm.draw(gmDrawCommand[i]);
	}
	_gm.font('./font/GenJyuuGothic-Monospace-Regular.ttf', 14);
	_gm.stroke('#eeee00');

	if (total_toroN_cards <= 10){
		// 10抽以內 toroBK_20_40.jpg
		_gm.drawText(4 + 375, 16 + 190, s.ttos_torototal + total_toroN_cards.toString() + ' 抽');
	}else if (total_toroN_cards <= 40){
		// 40抽以內 toroBK_20_40.jpg
		_gm.drawText(4 + 375, 16 + 190, s.ttos_torototal + total_toroN_cards.toString() + ' 抽');
	}else if (total_toroN_cards <= 80){
		// 80抽以內 toroBK_80.jpg
		_gm.drawText(4 + 375, 16 + 190 + 134, s.ttos_torototal + total_toroN_cards.toString() + ' 抽');
	}else if (total_toroN_cards <= 150){
		// 160抽以內 toroBK_160.jpg
		_gm.drawText(4 + 375, 16 + 190 + 134 + 324 + 14 + 3, s.ttos_torototal + total_toroN_cards.toString() + ' 抽');
	}else{
		// 150抽以上
		_gm.drawText(4 + 375, 16 + 190 + 134 + 324 + 14 + 3, s.ttos_torototal + total_toroN_cards.toString() + ' 抽');
		_gm.font('./font/GenJyuuGothic-Monospace-Regular.ttf', 40);	// 字型與字體大小指定
		_gm.drawText(50, 300, s.ttos_over150);			// 將字串指定位置寫入Mem
	}

	// ***** 因為line client端針對同一個URL，基本上只有第一次會載入，後面如果再送
	// 同樣的URL，就會用client端的memory載入而已。
	// 所以說，如果後台server更新圖片資料，用同一個URL，Line Client端是「不會更新」的。
	// 因此，這裏用一個小技巧，就是把圖檔檔名用亂數產生，這樣對Line Client端就會是不同
	// 的URL，當然也就能順利更新了。
	// ***** 只是temp目錄下的檔案會越來越多，在還沒有好的方式「自動刪」的情況下，
	// 要靠人工進server手動刪。不過，一張圖40K，1000張也才40MB，占空間不大。
	let minNum = 1;
	let maxNum = 1000000;
	let randN = basic_f.getRandom(minNum, maxNum);
	let toroFname = c.TOSMM_TORO_PIC_PATH_LOCAL_RW + 'tos_img/temp/' +
		randN.toString() + '.jpg';

	_gm.write(toroFname, function(err){
		if (err) {
			throw new Error(err);
		}
		let strPicAddress = c.TOSMM_TORO_PIC_PATH_TEMP + randN.toString() + '.jpg';
		
		_bot.getGroupMemberProfile(gID, uID).then((profile) => {
			_event.reply({
				type: 'image',
				originalContentUrl: strPicAddress,
				previewImageUrl: strPicAddress })
				.then(() => {	
					fmlog('command_msg',
						['GN:' + groupDB[idx].gname, idx, msg,
							toroResult.length + s.ttos_logtoro + rareTotalCards + s.ttos_lograre,
							profile.displayName, uID]);
				});
		});
	});

	return toroResult;	// 將抽卡結果陣列傳出
}

function _toro_tf(_event, _bot) {
	t_other.toro_r1(_event, _bot, 'tf1_img');
}

//////////////  Module Exports //////////////////
module.exports = {
	init : _init,
	toro_single : _toro_single,
	toro_10 : _toro_10,
	toro_n : _toro_n,
	toro_tf : _toro_tf
};