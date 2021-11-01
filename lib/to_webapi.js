'use strict';
const c = require('./const_def.js').init();
let request = require('request');
let apiUri = c.TOSMM_RESTFUL_URI;
const usr_mgr = require('./usr_mgr.js').init();

function _sendStatus() {
	let url = 'https://' + apiUri + '/tosmm/status';
	let options = {
		'method': 'POST',
		'url': url,
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		form: {
			'isalive': 'true',
			'online': 'ONLINE'
		}
	};

	request(options, function (error/*, response*/) {
		if (error) {
			//throw new Error(error);
			process.stdout.write('?');
		} else {
			//console.log(response.body);
			process.stdout.write('^');
		}
	});
}

function _sendStatistics_users() {
	let url = 'https://' + apiUri + '/tosmm/statistics/users';

	let options = {
		'method': 'POST',
		'url': url,
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		form: {
			'counts': usr_mgr.getTotalUsersCount(),
			'active': '0'
		}
	};

	request(options, function (error/*, response*/) {
		if (error) {
			//throw new Error(error);
			process.stdout.write('?');
		} else {
			//console.log(response.body);
			process.stdout.write('^');
		}
	});
}

function _sendStatistics_groups() {
	let url = 'https://' + apiUri + '/tosmm/statistics/groups';
	let groupDB = usr_mgr.getGDB();
	let num_alive = 0;

	for (let i = 0; i < groupDB.length; i++){
		if (groupDB[i].is_alive == true){	// 群組為有效群組，再進行統計
			num_alive++;
		}
	}

	let options = {
		'method': 'POST',
		'url': url,
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		form: {
			'counts': groupDB.length,
			'active': num_alive
		}
	};

	request(options, function (error/*, response*/) {
		if (error) {
			//throw new Error(error);
			process.stdout.write('?');
		} else {
			//console.log(response.body);
			process.stdout.write('^');
		}
	});
}

// 更新狀態 (is alive)
function _cycle_lv1() {
	setInterval(() => {
		_sendStatus();
	}, 2 * 60 * 1000); // 2 min
}

// 更新統計資訊
function _cycle_lv2() {
	setInterval(() => {
		_sendStatistics_users();
		_sendStatistics_groups();
	}, 3 * 60 * 1000); // 10 min
}

function _go() {
	_cycle_lv1();
	_cycle_lv2();
}

//////////////  Module Exports //////////////////
module.exports = {
	go: _go
};