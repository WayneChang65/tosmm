'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
const usr_mgr = require('./usr_mgr.js').init();

function _bot_audio_handler(_event , _bot) {
	let gID = _event.source.groupId;
	let uID = _event.source.userId;
	let groupDB = usr_mgr.getGDB();
	let idx = usr_mgr.getGIDX(gID);
	let cmdCatched = true;

	_bot.getGroupMemberProfile(gID, uID).then((profile) => {
		fmlog('basic_chat',
			['GN:' + groupDB[idx].gname, idx, '.............', 'Audio' , profile.displayName, uID]);
	});
	
	return cmdCatched;
}

/*..........................................................................*/
/*..........................Public Functions................................*/
/*..........................................................................*/

function _go(_event, _bot) {
	return _bot_audio_handler(_event, _bot);
}

//////////////  Module Exports //////////////////
module.exports = {
	go : _go
};