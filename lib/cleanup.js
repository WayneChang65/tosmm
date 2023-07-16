'use strict';
function noOp() {}

exports.Cleanup = function Cleanup(callback_saveJson, callback_crashHandler) {
	callback_saveJson = callback_saveJson || noOp;
	callback_crashHandler = callback_crashHandler || noOp;

	process.on('savJson', callback_saveJson);
	process.on('crashHandler', callback_crashHandler);

	// do app specific cleaning before exiting
	process.on('exit', function() {
		console.log('exit...');
	});

	process.on('SIGINT', function() {
		console.log('Ctrl-C... Terminate app after 20 secs.');
		let killtimer = setTimeout(function()
		{
			process.exit(2);
		}, 20 * 1000);
		process.emit('savJson');
		console.log(killtimer);
	});

	process.on('uncaughtException', function(e) {
		console.log('Uncaught Exception...');
		console.log(e.stack);
		let killtimer = setTimeout(function()
		{
			process.exit(99);
		}, 20 * 1000);
		console.log(killtimer);
		process.emit('savJson');
		process.emit('crashHandler', e.stack);	// 傳出 error stack
		console.log('crashHandler Processing...... Terminate app after 20 secs.');
	});
};
