'use strict';
const flex_level = require('./flex_level.js');

function _do(_event, _bot) {
	let msg = _event.message.text;
	let cmdCatched = true;

	switch (msg) {
	case 'me':
		flex_level.show(_event, _bot);	
		break;
	
	default:
		cmdCatched = false;
		break;
	}
	return cmdCatched;
}

//////////////  Module Exports //////////////////
module.exports = {
	do : _do
};