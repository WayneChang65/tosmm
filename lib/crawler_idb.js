'use strict';
const c = require('./const_def.js').init();
const fetch = require('node-fetch');

let apiUri = c.TOSMM_RESTFUL_URI;
const options = {
	'headers': {
		'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36'
	}
};

async function _getResults() {
	let url = 'https://' + apiUri + '/crawler/idb';
	const response = await fetch(url, options);
	let result = response.json();
	return result;
}

module.exports = {
	getResults: _getResults
};