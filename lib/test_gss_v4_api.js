'use strict';
const os = require('os');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const g_secret = require(os.homedir() + '/client_secret.json');
const c = require('./const_def.js').init();

let gDoc;

async function main () {
	gDoc = new GoogleSpreadsheet(c.TOSMM_GSID_WTESTWATER);
	await gDoc.useServiceAccountAuth(g_secret);
	await gDoc.loadInfo();
	console.log(gDoc.title);

	const sheet = gDoc.sheetsByIndex[0]; 
	console.log(sheet.title);
	console.log(sheet.rowCount);

	await sheet.loadCells(); // loads a range of cells
	//await sheet.loadCells('A1:B7'); // loads a range of cells
	/*
	await sheet.loadCells({
		startRowIndex: 2, 
		endRowIndex: 1001, 
		startColumnIndex:1, 
		endColumnIndex: 2
	});
	*/
	
	console.log(sheet.cellStats);

	for (let i = 0; i < 2; i++) {
		console.log('\n');
		for (let j = 0; j < 1000; j++) {
			let result = sheet.getCell(j, i);
			if (result.value != null)
				console.log(i.toString() + '-' + j.toString() + '-' + result.value);
			//console.log(result.value);
		}
	}

	//const a1 = sheet.getCell(2, 0);
	//const a2 = sheet.getCell(3, 0);
	//console.log(a1.value);
	//console.log(a2.value);
	//const c6 = sheet.getCellByA1('B7');
	//console.log(c6.value);
}

main();
