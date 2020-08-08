'use strict';
let request = require('request');
let apiUri = process.env.TOSMM_RESTFUL_URI;
const usr_mgr = require('./usr_mgr.js').init();

function _sendStatus() {
	let url = 'http://' + apiUri + '/tosmm/status';
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
	let url = 'http://' + apiUri + '/tosmm/statistics/users';
	let counts = usr_mgr.getTotalUsersCount();

	let options = {
		'method': 'POST',
		'url': url,
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		form: {
			'counts': counts,
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
	let url = 'http://' + apiUri + '/tosmm/statistics/groups';
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
	}, 10 * 1000); // 2.5 min
}

// 更新統計資訊
function _cycle_lv2() {
	setInterval(() => {
		_sendStatistics_users();
		_sendStatistics_groups();
	}, 15 * 1000); // 10 min
}

function _go() {
	_cycle_lv1();
	_cycle_lv2();
}

//////////////  Module Exports //////////////////
module.exports = {
	go: _go//,
	//sendMemberCount: _sendMemberCount
};