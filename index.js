/*
index.js -- tosmm.js -- crawler_handler.js 	-- crawler.js
											-- crawler_tos.js
							   				-- crawler_g8g.js

		 			 -- bot_txt_handler.js 	-- dev_test.js
							   				-- su_cmd.js
							   				-- push2reply.js
							   				-- custom_cmd.js
							   				-- nlp.js
							   				-- txt_react.js
							   				-- toro.js 		-- toro_other.js
										  					-- toro_tos.js
										  
		 			 -- bot_img_handler.js
		 			 -- bot_video_handler.js
		 			 -- bot_audio_handler.js
		 			 -- bot_location_handler.js
		 			 -- bot_sticker_handler.js
*/

'use strict';
const c = require('./lib/const_def.js').init();
/*........................................................................*/
/*.....................check 執行 TOSMM 所需要的環境變數.....................*/
if (!chekEnvVariables()) {
	console.log('[ERROR] Environment variables are not enough !!!');
	process.exit(1);
}
/*........................................................................*/
function chekEnvVariables() {
	if (
		// 土司小妹-水妍(default)
		// e.g.PORT_WATER="1234"
		// e.g.CHANNEL_ID_WATER="158xxxxxxx"
		// e.g.CHANNEL_SECRET_WATER="0a3e7xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		// e.g.CHANNEL_ACCESS_TOKEN_WATER="hLxtBgmjVzxxxxxxxxxxxxxxxxxxxxx"
		c.PORT_WATER && c.CHANNEL_ID_WATER && 
		c.CHANNEL_SECRET_WATER && c.CHANNEL_ACCESS_TOKEN_WATER &&

		// 土司小妹-火妍(test/dev)
		c.PORT_FIRE && c.CHANNEL_ID_FIRE &&
		c.CHANNEL_SECRET_FIRE && c.CHANNEL_ACCESS_TOKEN_FIRE &&

		// LINE USER ID
		// e.g.CLIENT_APP_USER_ID="U8xxxxxxxxxxxxxxxxxxxxxx"
		c.CLIENT_APP_USER_ID && 
		
		// 抽卡系列卡匣目錄名稱
		// e.g.TOSMM_TORO_SERIES="miku"
		c.TOSMM_TORO_SERIES &&

		// 【重要】Super User 指令的管理群組編號 (要設定，不然SU的指令會無效)
		// e.g.TOSMM_SU_GIDX="554"
		(c.TOSMM_SU_GIDX != undefined) &&

		// Bug Report 要傳訊息到 email的資訊
		c.BUG_REPORT_EMAIL_USER &&		// e.g. 'wayne654321'
		c.BUG_REPORT_EMAIL_PASSWORD &&	// e.g. 'yhmxxxxxxxxx'
		c.BUG_REPORT_EMAIL_SERVER_PORT &&	// e.g. 465
		c.BUG_REPORT_EMAIL_HOST &&		// e.g. 'smtp.gmail.com'
		c.BUG_REPORT_EMAIL_SSL &&			// e.g. true
		c.BUG_REPORT_EMAIL_FROM &&		// e.g. '土司小妹 <username@your-email.com>'
		c.BUG_REPORT_EMAIL_TO &&			// e.g. 'Wayne <wayne654321@gmail.com>'
		c.BUG_REPORT_EMAIL_CC &&			// e.g. 'David <David654321@gmail.com>'

		// Bitly的 Key
		// e.g.TOSMM_BITLY_KEY="652dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		c.TOSMM_BITLY_KEY && c.TOSMM_BITLY_1_KEY &&
		c.TOSMM_BITLY_2_KEY && c.TOSMM_BITLY_3_KEY &&
		c.TOSMM_BITLY_4_KEY && c.TOSMM_BITLY_5_KEY &&
		c.TOSMM_BITLY_6_KEY && c.TOSMM_BITLY_7_KEY &&

		// 客製化 command的 Google Spreadsheet的table id
		// e.g.TOSMM_GSID_WTESTWATER="1BjRxxxxxxxxxxxxxxxxxxxxxxxxx"
		c.TOSMM_GSID_WTESTWATER && c.TOSMM_GSID_SUPERMAN &&
		c.TOSMM_GSID_MAGGYBAN && c.TOSMM_GSID_LIULUNG &&
		c.TOSMM_GSID_YOSEITAIL && c.TOSMM_GSID_FUGUAN &&
		c.TOSMM_GSID_AUSHE
	){
		if (process.argv[2] != 'water') c.TOSMM_SU_GIDX = c.TOSMM_SU_GIDX_FIRE;
		return true;
	}else{
		return false;
	}
}
/*........................................................................*/
require('./lib/bug_report.js');
require('./lib/tosmm.js');
