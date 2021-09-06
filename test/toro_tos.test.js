'use strict';
const toro_tos2 = require('../lib/toro_tos.js');

describe('【Export functions】', () => {
	test('Init() - Should return', () => {
		expect(toro_tos2.init()).not.toBeNull();
	});
});