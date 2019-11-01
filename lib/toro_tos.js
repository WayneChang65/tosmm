'use strict';
//const fs = require('fs');
const basic_f = require('./basic_f.js');
const fmlog = require('@waynechang65/fml-consolelog').log;
const usr_mgr = require('./usr_mgr.js').init();
const gm = require('gm');
const t_other = require('./toro_other.js');
const fs = require('fs');
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
const c = require('./const_def.js').init();

// 未加倍機率小數點一位
const RARE_CHANCE_1 = 10; // 大獎 1 (保底)
const RARE_CHANCE_2 = 45; // 大獎 2
const RARE_CHANCE_3 = 45; // 大獎 3
const COM_CHANCE_1 = 180; // 
const COM_CHANCE_2 = 180; // 
const COM_CHANCE_3 = 180; // 
const COM_CHANCE_4 = 180; // 
const COM_CHANCE_5 = 180; //
const COM_CHANCE_6 = 0;   //
const COM_CHANCE_7 = 0;   //

// 加倍機率小數點一位
const RARE_CHANCE_1d = 25;	// 大獎 1 (保底)
const RARE_CHANCE_2d = 100;	// 大獎 2
const RARE_CHANCE_3d = 100;	// 大獎 3
const COM_CHANCE_1d = 155;	//
const COM_CHANCE_2d = 155;	//
const COM_CHANCE_3d = 155; 	//
const COM_CHANCE_4d = 155; 	// 
const COM_CHANCE_5d = 155; 	//
const COM_CHANCE_6d = 0; 	//
const COM_CHANCE_7d = 0; 	//

//const CHANCE_DOUBLE = true;
const CHANCE_NOT_DOUBLE = false;

const TOTAL_CARDS = 10;

let picTOS = [];
let realCards = 0;

let tos_series;

function _init(_tos_series) {
	picTOS.length = 0;
	tos_series = _tos_series;
	for (let i = 0; i < TOTAL_CARDS; i++) {
		picTOS.push(
			c.TOSMM_TORO_PIC_PATH_TOS +
			_tos_series + '/' + basic_f.numAddString0(i + 1, 4).toString()
			+ '.jpg'
		);
	}
	realCards = _getNumberOfTosToroCards();

	// 未加倍機率總和確認
	let totalChance = RARE_CHANCE_1 + RARE_CHANCE_2 + RARE_CHANCE_3 +
			COM_CHANCE_1 + COM_CHANCE_2 + COM_CHANCE_3 + COM_CHANCE_4 +
			COM_CHANCE_5 + COM_CHANCE_6 + COM_CHANCE_7;
	if (totalChance !== 1000) {
		fmlog('error_msg', [s.ttos_error, s.ttos_ne1000, totalChance]);
		return null;
	}

	// 加倍機率總和確認
	let totalChance_d = RARE_CHANCE_1d + RARE_CHANCE_2d + RARE_CHANCE_3d +
			COM_CHANCE_1d + COM_CHANCE_2d + COM_CHANCE_3d + COM_CHANCE_4d + 
			COM_CHANCE_5d + COM_CHANCE_6d + COM_CHANCE_7d;
	if (totalChance_d !== 1000) {
		fmlog('error_msg', [s.ttos_error, s.ttos_dne1000, totalChance_d]);
		return null;
	}

	return this;
}

/**
 * [依照TOS各卡的機率輸入，回傳抽到的卡]
 * 上限10張卡，如果低於10張卡，只要把多出來的卡機率設0就行了。
 * @param       {[type]} _event [linebot event]
 * @param       {[type]} arg1   [第1張卡的機率，為0-1000的整數]
 * @param       {[type]} arg2   [第2張卡的機率，為0-1000的整數]
 * @param       {[type]} arg3   [第3張卡的機率，為0-1000的整數]
 * @param       {[type]} arg4   [第4張卡的機率，為0-1000的整數]
 * @param       {[type]} arg5   [第5張卡的機率，為0-1000的整數]
 * @param       {[type]} arg6   [第6張卡的機率，為0-1000的整數]
 * @param       {[type]} arg7   [第7張卡的機率，為0-1000的整數]
 * @param       {[type]} arg8   [第8張卡的機率，為0-1000的整數]
 * @param       {[type]} arg9   [第9張卡的機率，為0-1000的整數]
 * @param       {[type]} arg10  [第10張卡的機率，為0-1000的整數]
 * @return      {[type]}        [抽到卡的結果1~10]
 */
function _getCardByChance(_event, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10){
	// 類似在一個輪盤上把所有機率區域標上去，然後再用亂數標一個值
	// 做法：total 1000個位子，1~9號卡，各依機率占幾個位子先填好。然後亂數射飛標射出，看射到誰就回傳誰。
	let ArrayCard1 = new Array(arg1);
	let ArrayCard2 = new Array(arg2);
	let ArrayCard3 = new Array(arg3);
	let ArrayCard4 = new Array(arg4);
	let ArrayCard5 = new Array(arg5);
	let ArrayCard6 = new Array(arg6);
	let ArrayCard7 = new Array(arg7);
	let ArrayCard8 = new Array(arg8);
	let ArrayCard9 = new Array(arg9);
	let ArrayCard10 = new Array(arg10);
	let ArrayAllCard = new Array();

	let i;
	for (i = 0; i < arg1; i++) ArrayCard1[i] = 1;
	for (i = 0; i < arg2; i++) ArrayCard2[i] = 2;
	for (i = 0; i < arg3; i++) ArrayCard3[i] = 3;
	for (i = 0; i < arg4; i++) ArrayCard4[i] = 4;
	for (i = 0; i < arg5; i++) ArrayCard5[i] = 5;
	for (i = 0; i < arg6; i++) ArrayCard6[i] = 6;
	for (i = 0; i < arg7; i++) ArrayCard7[i] = 7;
	for (i = 0; i < arg8; i++) ArrayCard8[i] = 8;
	for (i = 0; i < arg9; i++) ArrayCard9[i] = 9;
	for (i = 0; i < arg10; i++) ArrayCard10[i] = 10;

	ArrayAllCard = ArrayAllCard.concat(ArrayCard1);
	ArrayAllCard = ArrayAllCard.concat(ArrayCard2);
	ArrayAllCard = ArrayAllCard.concat(ArrayCard3);
	ArrayAllCard = ArrayAllCard.concat(ArrayCard4);
	ArrayAllCard = ArrayAllCard.concat(ArrayCard5);
	ArrayAllCard = ArrayAllCard.concat(ArrayCard6);
	ArrayAllCard = ArrayAllCard.concat(ArrayCard7);
	ArrayAllCard = ArrayAllCard.concat(ArrayCard8);
	ArrayAllCard = ArrayAllCard.concat(ArrayCard9);
	ArrayAllCard = ArrayAllCard.concat(ArrayCard10);

	// 洗牌一下。 (其實只要random函數夠亂，也不用洗牌再射了。算是洗安心的。)
	ArrayAllCard = basic_f.shuffle(ArrayAllCard);

	let minNum = 0;
	let maxNum = 999;
	let randN = basic_f.getRandom(minNum, maxNum);

	return ArrayAllCard[randN];
}

/*
function _getRealCards(_picTOS) {
	let realCards = 0;
	for (let i = 0; i < _picTOS.length; i++) if(_picTOS[i]) realCards++;
	return realCards;
}
*/

function _toro_single(_event, _bot, _doubleChance = CHANCE_NOT_DOUBLE) {
	let randN;
	let pic_address;

	let msg = _event.message.text;
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);

	if (_doubleChance) {
		randN = _getCardByChance(_event, RARE_CHANCE_1d, RARE_CHANCE_2d, RARE_CHANCE_3d,
			COM_CHANCE_1d, COM_CHANCE_2d, COM_CHANCE_3d, COM_CHANCE_4d, COM_CHANCE_5d, COM_CHANCE_6d, COM_CHANCE_7d) - 1;
	}else{
		randN = _getCardByChance(_event, RARE_CHANCE_1, RARE_CHANCE_2, RARE_CHANCE_3,
			COM_CHANCE_1, COM_CHANCE_2, COM_CHANCE_3, COM_CHANCE_4, COM_CHANCE_5, COM_CHANCE_6, COM_CHANCE_7) - 1;
	}
	pic_address = picTOS[randN];

	_bot.getGroupMemberProfile(gID, uID).then((profile) => {
		_event.reply({
			type: 'image',
			originalContentUrl: pic_address,
			previewImageUrl: pic_address })
			.then(() => {	
				fmlog('command_msg',
					['GN:' + groupDB[idx].gname, idx, msg,
						'No.' + String(randN + 1) + '/' +
						realCards, profile.displayName, uID]);
			});
	});
}

// 功能：TOS一次十抽機能，將十抽卡片合成一張卡片輸出，並且畫出邊框。
// 參數：_event，linebot的事件物件
//      _isChanceDouble：如果是CHANCE_NOT_DOUBLE代表沒加倍，CHANCE_DOUBLE代表加倍
// 回傳：回傳抽卡結果陣列
function _toro_10(_event, _bot, _doubleChance = CHANCE_NOT_DOUBLE){

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
			toroResult.push(_getCardByChance(_event, RARE_CHANCE_1d, RARE_CHANCE_2d, RARE_CHANCE_3d,
				COM_CHANCE_1d, COM_CHANCE_2d, COM_CHANCE_3d, COM_CHANCE_4d, COM_CHANCE_5d, COM_CHANCE_6d, COM_CHANCE_7d) - 1);
		}else{
			toroResult.push(_getCardByChance(_event, RARE_CHANCE_1, RARE_CHANCE_2, RARE_CHANCE_3,
				COM_CHANCE_1, COM_CHANCE_2, COM_CHANCE_3, COM_CHANCE_4, COM_CHANCE_5, COM_CHANCE_6, COM_CHANCE_7) - 1);
		}

		toroResult_picPath.push(
			'/usr/share/httpd/noindex/images/lb_images/tos_img/' +
			tos_series + '/' + basic_f.numAddString0(toroResult[toroResult.length - 1] + 1, 4).toString() + '.jpg'
		);
	}
	//console.log(toroResult);

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
	let _gm = gm('/usr/share/httpd/noindex/images/lb_images/tos_img/bk/toroBK.jpg');

	// 畫大獎邊框
	// 分成上面五個跟下面五個圖來處理
	// drawRectangle指令其實是畫矩形。只是這裏利用先畫矩形，然後再用圖疊上去的方式，
	// 製造出邊框效果。
	for (i = 0; i < numOfRows; i++){
		for (j = 0; j < numOfColumns; j++){
			if (toroResult[numOfColumns * i + j] == 0 || toroResult[numOfColumns * i + j] == 1 || toroResult[numOfColumns * i + j] == 2){
				_gm.fill('yellow')
					.stroke('#ffffff')
					.drawRectangle(location_1stPic_Left + (picWidth + pic2picSpan) * j - lWidth,
						location_1stPic_Top + (picWidth + pic2picSpan) * i - lWidth,
						location_1stPic_Left + (picWidth + pic2picSpan) * j + picWidth + lWidth,
						location_1stPic_Top + (picWidth + pic2picSpan) * i + picHight + lWidth);
			}
		}
	}
	//console.log(gmDrawCommand1);

	for (i = 0; i < numOfCards; i++){
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
	let toroFname = '/usr/share/httpd/noindex/images/lb_images/tos_img/temp/' +
		randN.toString() + '.jpg';

	//console.log(toroFname);
	_gm.write(toroFname, function(err){
		if (!err){
			//console.log('Write file successfully.---test001.jpg');
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
// 回傳：回傳抽卡結果陣列
/*
function _toro_n(_event, _bot, _doubleChance = CHANCE_NOT_DOUBLE) {	
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
	let total_TosCards = _getNumberOfTosToroCards();

	for (i = 0; i < total_TosCards; i++){
		aryTestFinish.push(i.toString());
	}

	for (i = 0; i < 1000; i++) {
		total_toroN_cards = i;
		//console.log(aryTestFinish.length);
		if (aryTestFinish.length == 0) break;
		if (_doubleChance == CHANCE_NOT_DOUBLE){	// 沒加倍
			if ((i + 1) % 35 == 0){
				toroResult.push('0');	// 第一大獎，小傑 每35抽保底
			}else{
				toroResult.push((_getCardByChance(_event, RARE_CHANCE_1, RARE_CHANCE_2, RARE_CHANCE_3,
					COM_CHANCE_1, COM_CHANCE_2, COM_CHANCE_3, COM_CHANCE_4, COM_CHANCE_5, COM_CHANCE_6, COM_CHANCE_7) - 1).toString());
			}
		}else{										// 加倍
			if ((i + 1) % 35 == 0){
				toroResult.push('0');	// 第一大獎，小傑 每35抽保底
			}else{
				toroResult.push((_getCardByChance(_event, RARE_CHANCE_1d, RARE_CHANCE_2d, RARE_CHANCE_3d,
					COM_CHANCE_1d, COM_CHANCE_2d, COM_CHANCE_3d, COM_CHANCE_4d, COM_CHANCE_5d, COM_CHANCE_6d, COM_CHANCE_7d) - 1).toString());
			}
		}
		aryTestFinish = basic_f.removeA(aryTestFinish, toroResult[i]);

	}

	let toroResult_picPath = [];
	for (i = 0; i < total_toroN_cards; i++){
		toroResult_picPath.push(
			'/usr/share/httpd/noindex/images/lb_images/tos_img/' +
			tos_series + '/' + basic_f.numAddString0(parseInt(toroResult[i]) + 1, 4).toString() + '.jpg'
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

		gmBK_fileName = '/usr/share/httpd/noindex/images/lb_images/tos_img/bk/toroBK_20_40.jpg';
	}else if (total_toroN_cards <= 40){
		// 40抽以內 toroBK_20_40.jpg
		lWidth = 3;
		location_1stPic_Left = 30;
		location_1stPic_Top = 20;
		pic2picSpan = 5;
		picWidth = 40 ;
		picHight = 40;

		numOfColumns = 10;

		gmBK_fileName = '/usr/share/httpd/noindex/images/lb_images/tos_img/bk/toroBK_20_40.jpg';
	}else if (total_toroN_cards <= 80){
		// 80抽以內 toroBK_80.jpg
		lWidth = 3;
		location_1stPic_Left = 30 + 15;
		location_1stPic_Top = 20;
		pic2picSpan = 5;
		picWidth = 35 ;
		picHight = 35;

		numOfColumns = 10;

		gmBK_fileName = '/usr/share/httpd/noindex/images/lb_images/tos_img/bk/toroBK_80.jpg';
	}else if (total_toroN_cards <= 150){
		// 160抽以內 toroBK_160.jpg
		lWidth = 3;
		location_1stPic_Left = 30;
		location_1stPic_Top = 20 - 8;
		pic2picSpan = 5;
		picWidth = 40 ;
		picHight = 40;

		numOfColumns = 10;

		gmBK_fileName = '/usr/share/httpd/noindex/images/lb_images/tos_img/bk/toroBK_160.jpg';
	}else{
		// 150抽以上
		lWidth = 3;
		location_1stPic_Left = 30;
		location_1stPic_Top = 20 - 8;
		pic2picSpan = 5;
		picWidth = 40 ;
		picHight = 40;

		numOfColumns = 10;

		gmBK_fileName = '/usr/share/httpd/noindex/images/lb_images/tos_img/bk/toroBK_160.jpg';
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
			if (toroResult[numOfColumns * i + j] == 0 || toroResult[numOfColumns * i + j] == 1 || toroResult[numOfColumns * i + j] == 2){
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
	//console.log(gmDrawCommand1);

	for (i = 0; i < numOfCards; i++){
		_gm.draw(gmDrawCommand[i]);
	}

	_gm.font('./font/GenJyuuGothic-Monospace-Regular.ttf', 14);
	_gm.stroke('#eeee00');

	if (total_toroN_cards <= 10){
		// 10抽以內 toroBK_20_40.jpg
		_gm.drawText(4 + 375, 16 + 190, '總抽卡數是 ' + total_toroN_cards.toString() + ' 抽');
	}else if (total_toroN_cards <= 40){
		// 40抽以內 toroBK_20_40.jpg
		_gm.drawText(4 + 375, 16 + 190, '總抽卡數是 ' + total_toroN_cards.toString() + ' 抽');
	}else if (total_toroN_cards <= 80){
		// 80抽以內 toroBK_80.jpg
		_gm.drawText(4 + 375, 16 + 190 + 134, '總抽卡數是 ' + total_toroN_cards.toString() + ' 抽');
	}else if (total_toroN_cards <= 150){
		// 160抽以內 toroBK_160.jpg
		_gm.drawText(4 + 375, 16 + 190 + 134 + 324 + 14 + 3, '總抽卡數是 ' + total_toroN_cards.toString() + ' 抽');
	}else{
		// 150抽以上
		_gm.drawText(4 + 375, 16 + 190 + 134 + 324 + 14 + 3, '總抽卡數是 ' + total_toroN_cards.toString() + ' 抽');
		_gm.font('./font/GenJyuuGothic-Monospace-Regular.ttf', 40);	// 字型與字體大小指定
		_gm.drawText(50, 300, '超過150抽，您也太黑了！');			// 將字串指定位置寫入Mem
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
	let toroFname = '/usr/share/httpd/noindex/images/lb_images/tos_img/temp/' +
		randN.toString() + '.jpg';

	_gm.write(toroFname, function(err){
		if (!err){
			//console.log('Write file successfully.---test001.jpg');
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
							toroResult.length + ' 抽 - ' + rareTotalCards + ' 稀有。',
							profile.displayName, uID]);
				});
		});
	});

	return toroResult;	// 將抽卡結果陣列傳出
}
*/

// 功能：TOS抽好抽滿機能，將N張抽滿抽卡片合成一張卡片輸出，並且畫出邊框。
// 參數：_event，linebot的事件物件
//      _isChanceDouble：如果是CHANCE_NOT_DOUBLE代表沒加倍，CHANCE_DOUBLE代表加倍
//      _version：抽卡保底機制的版本
//			1:每35抽送1張最大獎。
//			2:增加在35抽時，送一個素材。
//            可以利用一張重覆的2獎加上這個素材，換一張你還沒有抽到的2獎。
// 回傳：回傳抽卡結果陣列

function _toro_n(_event, _bot, _doubleChance = CHANCE_NOT_DOUBLE, _version = 2) {	
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
	let total_TosCards = _getNumberOfTosToroCards();

	for (i = 0; i < total_TosCards; i++){
		aryTestFinish.push(i.toString());
	}

	for (i = 0; i < 1000; i++) {
		total_toroN_cards = i;
		//console.log(aryTestFinish.length);
		if (aryTestFinish.length == 0) break;
		if (_doubleChance == CHANCE_NOT_DOUBLE){	// 沒加倍
			if ((i + 1) % 35 == 0){
				toroResult.push('0');	// 第一大獎，小傑 每35抽保底
			}else{
				toroResult.push((_getCardByChance(_event, RARE_CHANCE_1, RARE_CHANCE_2, RARE_CHANCE_3,
					COM_CHANCE_1, COM_CHANCE_2, COM_CHANCE_3, COM_CHANCE_4, COM_CHANCE_5, COM_CHANCE_6, COM_CHANCE_7) - 1).toString());
			}
		}else{										// 加倍
			if ((i + 1) % 35 == 0){
				toroResult.push('0');	// 第一大獎，小傑 每35抽保底
			}else{
				toroResult.push((_getCardByChance(_event, RARE_CHANCE_1d, RARE_CHANCE_2d, RARE_CHANCE_3d,
					COM_CHANCE_1d, COM_CHANCE_2d, COM_CHANCE_3d, COM_CHANCE_4d, COM_CHANCE_5d, COM_CHANCE_6d, COM_CHANCE_7d) - 1).toString());
			}
		}
		aryTestFinish = basic_f.removeA(aryTestFinish, toroResult[i]);

		switch (_version) {
		case 1:
			break;
		case 2:
			if ((i + 1) >= 35) {	// 35抽以後(包含第35抽)
				let countResult = basic_f.countElmOfArray(toroResult);	// 計算每張卡各重覆抽了幾張
				let getCards = Object.keys(countResult);	// 傳回抽了哪些卡的陣列(不重覆計算)
				if (!getCards.includes('1') || !getCards.includes('2')) {
					if(countResult['1'] >= 2){
						aryTestFinish = basic_f.removeA(aryTestFinish, '2');
					}else if(countResult['2'] >= 2){
						aryTestFinish = basic_f.removeA(aryTestFinish, '1');
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
			'/usr/share/httpd/noindex/images/lb_images/tos_img/' +
			tos_series + '/' + basic_f.numAddString0(parseInt(toroResult[i]) + 1, 4).toString() + '.jpg'
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

		gmBK_fileName = '/usr/share/httpd/noindex/images/lb_images/tos_img/bk/toroBK_20_40.jpg';
	}else if (total_toroN_cards <= 40){
		// 40抽以內 toroBK_20_40.jpg
		lWidth = 3;
		location_1stPic_Left = 30;
		location_1stPic_Top = 20;
		pic2picSpan = 5;
		picWidth = 40 ;
		picHight = 40;

		numOfColumns = 10;

		gmBK_fileName = '/usr/share/httpd/noindex/images/lb_images/tos_img/bk/toroBK_20_40.jpg';
	}else if (total_toroN_cards <= 80){
		// 80抽以內 toroBK_80.jpg
		lWidth = 3;
		location_1stPic_Left = 30 + 15;
		location_1stPic_Top = 20;
		pic2picSpan = 5;
		picWidth = 35 ;
		picHight = 35;

		numOfColumns = 10;

		gmBK_fileName = '/usr/share/httpd/noindex/images/lb_images/tos_img/bk/toroBK_80.jpg';
	}else if (total_toroN_cards <= 150){
		// 160抽以內 toroBK_160.jpg
		lWidth = 3;
		location_1stPic_Left = 30;
		location_1stPic_Top = 20 - 8;
		pic2picSpan = 5;
		picWidth = 40 ;
		picHight = 40;

		numOfColumns = 10;

		gmBK_fileName = '/usr/share/httpd/noindex/images/lb_images/tos_img/bk/toroBK_160.jpg';
	}else{
		// 150抽以上
		lWidth = 3;
		location_1stPic_Left = 30;
		location_1stPic_Top = 20 - 8;
		pic2picSpan = 5;
		picWidth = 40 ;
		picHight = 40;

		numOfColumns = 10;

		gmBK_fileName = '/usr/share/httpd/noindex/images/lb_images/tos_img/bk/toroBK_160.jpg';
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
			if (toroResult[numOfColumns * i + j] == 0 || toroResult[numOfColumns * i + j] == 1 || toroResult[numOfColumns * i + j] == 2){
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
	//console.log(gmDrawCommand1);

	for (i = 0; i < numOfCards; i++){
		_gm.draw(gmDrawCommand[i]);
	}

	_gm.font('./font/GenJyuuGothic-Monospace-Regular.ttf', 14);
	_gm.stroke('#eeee00');

	if (total_toroN_cards <= 10){
		// 10抽以內 toroBK_20_40.jpg
		_gm.drawText(4 + 375, 16 + 190, '總抽卡數是 ' + total_toroN_cards.toString() + ' 抽');
	}else if (total_toroN_cards <= 40){
		// 40抽以內 toroBK_20_40.jpg
		_gm.drawText(4 + 375, 16 + 190, '總抽卡數是 ' + total_toroN_cards.toString() + ' 抽');
	}else if (total_toroN_cards <= 80){
		// 80抽以內 toroBK_80.jpg
		_gm.drawText(4 + 375, 16 + 190 + 134, '總抽卡數是 ' + total_toroN_cards.toString() + ' 抽');
	}else if (total_toroN_cards <= 150){
		// 160抽以內 toroBK_160.jpg
		_gm.drawText(4 + 375, 16 + 190 + 134 + 324 + 14 + 3, '總抽卡數是 ' + total_toroN_cards.toString() + ' 抽');
	}else{
		// 150抽以上
		_gm.drawText(4 + 375, 16 + 190 + 134 + 324 + 14 + 3, '總抽卡數是 ' + total_toroN_cards.toString() + ' 抽');
		_gm.font('./font/GenJyuuGothic-Monospace-Regular.ttf', 40);	// 字型與字體大小指定
		_gm.drawText(50, 300, '超過150抽，您也太黑了！');			// 將字串指定位置寫入Mem
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
	let toroFname = '/usr/share/httpd/noindex/images/lb_images/tos_img/temp/' +
		randN.toString() + '.jpg';

	_gm.write(toroFname, function(err){
		if (!err){
			//console.log('Write file successfully.---test001.jpg');
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
							toroResult.length + ' 抽 - ' + rareTotalCards + ' 稀有。',
							profile.displayName, uID]);
				});
		});
	});

	return toroResult;	// 將抽卡結果陣列傳出
}

// 功能：從全域的機率變數，去判斷目前TOS卡匣有幾張卡
function _getNumberOfTosToroCards() {
	let i = 0;
	if (RARE_CHANCE_1 != 0) i++;
	if (RARE_CHANCE_2 != 0) i++;
	if (RARE_CHANCE_3 != 0) i++;
	if (COM_CHANCE_1 != 0) i++;
	if (COM_CHANCE_2 != 0) i++;
	if (COM_CHANCE_3 != 0) i++;
	if (COM_CHANCE_4 != 0) i++;
	if (COM_CHANCE_5 != 0) i++;
	if (COM_CHANCE_6 != 0) i++;
	if (COM_CHANCE_7 != 0) i++;
	return i;
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
	//toro_n2 : _toro_n2,
	toro_tf : _toro_tf
};