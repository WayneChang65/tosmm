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
/*........................................................................*/
/*.....................check 執行 TOSMM 所需要的環境變數.....................*/
if (!chekEnvVariables()) {
	console.log('[ERROR] Environment variables are not enough !!!');
	process.exit(1);
}
/*........................................................................*/
function chekEnvVariables() {
	let env = process.env;
	if (
		// 土司小妹-水妍(default)
		// e.g.PORT_WATER="1234"
		// e.g.CHANNEL_ID_WATER="158xxxxxxx"
		// e.g.CHANNEL_SECRET_WATER="0a3e7xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		// e.g.CHANNEL_ACCESS_TOKEN_WATER="hLxtBgmjVzxxxxxxxxxxxxxxxxxxxxx"
		env.PORT_WATER && env.CHANNEL_ID_WATER && 
		env.CHANNEL_SECRET_WATER && env.CHANNEL_ACCESS_TOKEN_WATER &&

		// 土司小妹-火妍(test/dev)
		env.PORT_FIRE && env.CHANNEL_ID_FIRE &&
		env.CHANNEL_SECRET_FIRE && env.CHANNEL_ACCESS_TOKEN_FIRE &&

		// LINE USER ID
		// e.g.CLIENT_APP_USER_ID="U8xxxxxxxxxxxxxxxxxxxxxx"
		env.CLIENT_APP_USER_ID && 
		
		// 抽卡系列卡匣目錄名稱
		// e.g.TOSMM_TORO_SERIES="miku"
		env.TOSMM_TORO_SERIES &&

		// 【重要】Super User 指令的管理群組編號 (要設定，不然SU的指令會無效)
		// e.g.TOSMM_SU_GIDX="554"
		env.TOSMM_SU_GIDX &&

		// Bug Report 要傳訊息到 email的資訊
		env.BUG_REPORT_EMAIL_USER &&		// e.g. 'wayne654321'
		env.BUG_REPORT_EMAIL_PASSWORD &&	// e.g. 'yhmxxxxxxxxx'
		env.BUG_REPORT_EMAIL_SERVER_PORT &&	// e.g. 465
		env.BUG_REPORT_EMAIL_HOST &&		// e.g. 'smtp.gmail.com'
		env.BUG_REPORT_EMAIL_SSL &&			// e.g. true
		env.BUG_REPORT_EMAIL_FROM &&		// e.g. '土司小妹 <username@your-email.com>'
		env.BUG_REPORT_EMAIL_TO &&			// e.g. 'Wayne <wayne654321@gmail.com>'
		env.BUG_REPORT_EMAIL_CC &&			// e.g. 'David <David654321@gmail.com>'

		// Bitly的 Key
		// e.g.TOSMM_BITLY_KEY="652dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		env.TOSMM_BITLY_KEY && env.TOSMM_BITLY_1_KEY &&
		env.TOSMM_BITLY_2_KEY && env.TOSMM_BITLY_3_KEY &&
		env.TOSMM_BITLY_4_KEY &&

		// 客製化 command的 Google Spreadsheet的table id
		// e.g.TOSMM_GSID_WTESTWATER="1BjRxxxxxxxxxxxxxxxxxxxxxxxxx"
		env.TOSMM_GSID_WTESTWATER && env.TOSMM_GSID_SUPERMAN &&
		env.TOSMM_GSID_MAGGYBAN && env.TOSMM_GSID_LIULUNG &&
		env.TOSMM_GSID_YOSEITAIL && env.TOSMM_GSID_FUGUAN &&
		env.TOSMM_GSID_AUSHE
	){
		return true;
	}else{
		return false;
	}
}
/*........................................................................*/
require('./lib/bug_report.js');
require('./lib/tosmm.js');
