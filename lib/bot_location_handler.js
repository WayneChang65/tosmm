'use strict';

function _bot_location_handler(/*_event, _bot*/) {
	let cmdCatched = false;

	return cmdCatched;
}

/*..........................................................................*/
/*..........................Public Functions................................*/
/*..........................................................................*/

function _go(/*_event, _bot*/) {
	return _bot_location_handler(/*_event, _bot*/);
}

//////////////  Module Exports //////////////////
module.exports = {
	go : _go
};