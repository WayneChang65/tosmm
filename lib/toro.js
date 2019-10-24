'use strict';
const c = require('./const_def.js').init();
const t_other = require('./toro_other.js');
const t_tos = require('./toro_tos.js').init(c.TOSMM_TORO_SERIES);

function _tg(_event, _bot) {
	t_other.toro_r1(_event, _bot, 'tg1_img');
}

function _tb(_event, _bot) {
	t_other.toro_r1(_event, _bot, 'tb1_img');
}

function _tsm(_event, _bot) {
	t_other.toro_r1(_event, _bot, 'tsm_img');
}

function _asa(_event, _bot) {
	t_other.toro_asa(_event, _bot);
}

function _sm_asa(_event, _bot) {
	t_other.toro_asa(_event, _bot, true);
}

function _kuzi(_event, _bot) {
	t_other.toro_kuzi(_event, _bot);
}

function _tos_single(_event, _bot, _doubleChance) {
	t_tos.toro_single(_event, _bot, _doubleChance);
}

function _tos_10(_event, _bot, _doubleChance) {
	t_tos.toro_10(_event, _bot, _doubleChance);
}

function _tos_n(_event, _bot, _doubleChance) {
	t_tos.toro_n(_event, _bot, _doubleChance);
}

/*
function _tos_n2(_event, _bot, _doubleChance) {
	t_tos.toro_n2(_event, _bot, _doubleChance);
}
*/

function _tf(_event, _bot) {
	t_tos.toro_tf(_event, _bot);
}

function _tcard_chance(_event, _bot, _imgNameWithUrl) {
	t_other.toro_1(_event, _bot, _imgNameWithUrl);
}

function _tcard_chance_d(_event, _bot, _imgNameWithUrl) {
	t_other.toro_1(_event, _bot, _imgNameWithUrl);
}

//////////////  Module Exports //////////////////
module.exports = {
	tg: _tg,
	tb: _tb,
	tsm: _tsm,
	asa: _asa,
	sm_asa: _sm_asa,
	kuzi: _kuzi,

	tos_single : _tos_single,
	tos_10 : _tos_10,
	tos_n : _tos_n,
	//tos_n2 : _tos_n2,
	tf: _tf,
	tchance : _tcard_chance,
	tchanced : _tcard_chance_d
};