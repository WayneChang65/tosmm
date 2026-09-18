'use strict';
const c = require('./const_def.js').init();
const fetch = require('node-fetch');
let apiUri = c.TOSMM_RESTFUL_URI;
const usr_mgr = require('./usr_mgr.js').init();

function _postForm(url, formFields) {
	const body = new URLSearchParams(formFields).toString();
	return fetch(url, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body
	}).then(function (response) {
		if (process.env.TOSMM_WEBAPI_DEBUG === 'true') {
			//console.log(response.body);
			console.log('webapi status: ' + response.status);
		}
		process.stdout.write('^');
	}, function (error) {
		if (process.env.TOSMM_WEBAPI_DEBUG === 'true') {
			//throw new Error(error);
			console.log('webapi error: ' + error);
		}
		process.stdout.write('?');
	});
}

function _sendStatus() {
	let url = 'https://' + apiUri + '/tosmm/status';
	return _postForm(url, {
		'isalive': 'true',
		'online': 'ONLINE'
	});
}

function _sendStatistics_users() {
	let url = 'https://' + apiUri + '/tosmm/statistics/users';
	return _postForm(url, {
		'counts': usr_mgr.getTotalUsersCount(),
		'active': '0'
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

	return _postForm(url, {
		'counts': groupDB.length,
		'active': num_alive
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
