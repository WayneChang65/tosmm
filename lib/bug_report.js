'use strict';
const email = require('emailjs');
const cmd_ana = require('./cmd_ana.js');
const flex_level = require('./flex_level.js');
const fmlog = require('@waynechang65/fml-consolelog').log;
const fs = require('fs');
const c = require('./const_def.js').init();
const json5 = require('json5');
const s = json5.parse(fs.readFileSync('./res/strtable_TW.json5'));
require('./cleanup.js').Cleanup(_saveDBs, sendEmailToWayne);

// 自動寄eMail給 Wayne Chang
// 目前是設定當土司小妹發生crash時所發出
function sendEmailToWayne(_msgWillSend) {
	let server 	= email.server.connect({
		user:    c.BUG_REPORT_EMAIL_USER,
		password:c.BUG_REPORT_EMAIL_PASSWORD,
		port:	 c.BUG_REPORT_EMAIL_SERVER_PORT,
		host:    c.BUG_REPORT_EMAIL_HOST,
		ssl:     c.BUG_REPORT_EMAIL_SSL === 'true'
	});
	server.send({
		text:    'Wayne 主人、您好。土司小妹現在有點問題，請您播空處理。謝謝您。\n\n' + _msgWillSend,
		from:    c.BUG_REPORT_EMAIL_FROM,
		to:      c.BUG_REPORT_EMAIL_TO,
		cc:      c.BUG_REPORT_EMAIL_CC,
		subject: 'Crash from 土司小妹-test'
	}, function(err, message) { fmlog('error_msg', [s.br_br, s.br_crash, err || message]); });
}

function _saveDBs() {
	cmd_ana.save();
	flex_level.save();
}