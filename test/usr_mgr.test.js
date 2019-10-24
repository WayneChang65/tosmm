'use strict';

const usr_mgr = require('../lib/usr_mgr.js')
	.init('../test/db/tos_group_db.json', './test/db/tos_group_db.json');

const fake_event = {
	source: {
		groupId: 'Cf30a163d900ea30309e10222eebf5082'
	},
	message:{
		text: 'This is a fake event message.'
	}
};

////////////////////////////
//      基礎測試           //
////////////////////////////
describe('【Basic functions】', () => {
	test('Test for definition of SU_GIDX', () => {
		let SU_GIDX =  process.env.TOSMM_SU_GIDX;
		expect(SU_GIDX).not.toBeUndefined();
	});

	test('Test for init()', () => {
		expect(async () => {
			let groupDB;

			usr_mgr.init('../test/db/tos_group_db2.json', './test/db/tos_group_db2.json');
			groupDB = usr_mgr.getGDB();
			expect(groupDB.length).toEqual(4);
			expect(groupDB[0].gname).toMatch('小妹測試空間11111');
			expect(groupDB[1].gname).toMatch('小妹測試空間22222');
				
			usr_mgr.init('../test/db/tos_group_db.json', './test/db/tos_group_db.json');
			groupDB = usr_mgr.getGDB();
			expect(groupDB.length).toEqual(5);
			expect(groupDB[0].gname).toMatch('小妹測試空間456');
			expect(groupDB[1].gname).toMatch('小妹測試空間2');
		}).not.toThrow();
	});

	test('Test for getGDB()', () => {
		expect(usr_mgr.getGDB().length).toEqual(5);
	});

	test('Test for save()', async() => {
		expect(() => {
			usr_mgr.saveGDB(usr_mgr.getGDB());
		}).not.toThrow();
	});

	test('Test for getGIDX()', () => {
		let tosmm_test_gID = 'Cf30a163d900ea30309e10222eebf5082';
		expect(usr_mgr.getGIDX(tosmm_test_gID)).toEqual(0);

		let superman_test_gID = 'Cd73f0503339b419b7e0e0fc7111b54dc';
		expect(usr_mgr.getGIDX(superman_test_gID)).toEqual(1);
	});
});

////////////////////////////
// 「w管理者設定」 指令測試 //
////////////////////////////
describe('【w管理者設定】', () => {
	test('Test for setGroupMgr()-NOT SU_GIDX [w管理者設定]', async () => {
		// 無法指定管理者的群組ID
		try {
			fake_event.source.groupId = 'ABCD12345678912345678912341111111';
			fake_event.message.text = 'w管理者設定 3 U76c78ee9bc01aa935e16661234567890 名字456';
			expect(await usr_mgr.setGroupMgr(fake_event)).toBeNull();
		} catch (err) {
			console.error(err);
		}
	});

	test('Test for setGroupMgr()-command items are NOT enough [w管理者設定]', async () => {
		// 無法指定管理者的群組ID
		try {
			// 可以指定管理者的群組ID，但是指令不全(缺項)
			// 只有 'Cf30a163d900ea30309e10222eebf5082'這個群組可以進行管理者相關設定
			fake_event.source.groupId = 'Cf30a163d900ea30309e10222eebf5082';
			fake_event.message.text = 'w管理者設定 3 U76c78ee9bc01aa935e1666346ba10539';
			expect(await usr_mgr.setGroupMgr(fake_event)).toBeNull();
		} catch (err) {
			console.error(err);
		}
	});

	test('Test for setGroupMgr()-CORRECT command-1 [w管理者設定]', async () => {
		try {
			// 可以指定管理者的群組ID，指令正確
			let groupDB = usr_mgr.getGDB();
			fake_event.source.groupId = 'Cf30a163d900ea30309e10222eebf5082';
			fake_event.message.text = 'w管理者設定 3 U76c78ee9bc01aa935e1666346ba10539 名字123';

			let idx = await usr_mgr.setGroupMgr(fake_event);
			expect(idx).toEqual(3);
			expect(groupDB[3].mgr_name).toMatch('名字123');
			expect(groupDB[3].mgr_id).toMatch('U76c78ee9bc01aa935e1666346ba10539');
		} catch (err) {
			console.error(err);
			throw err;
		}
	});

	test('Test for setGroupMgr()-CORRECT command-2 [w管理者設定]', async () => {
		try {
			// 可以指定管理者的群組ID，指令正確
			let groupDB = usr_mgr.getGDB();
			fake_event.source.groupId = 'Cf30a163d900ea30309e10222eebf5082';
			fake_event.message.text = 'w管理者設定 3 U76c78ee9bc01aa935e16661234567890 名字456';

			let idx = await usr_mgr.setGroupMgr(fake_event);
			expect(idx).toEqual(3);
			expect(groupDB[3].mgr_name).toMatch('名字456');
			expect(groupDB[3].mgr_id).toMatch('U76c78ee9bc01aa935e16661234567890');
		} catch (err) {
			console.error(err);
			throw err;
		}
	});

	test('Test for setGroupMgr()-CORRECT command-3 [w管理者設定]', async () => {
		try {
			// 可以指定管理者的群組ID，指令正確
			let groupDB = usr_mgr.getGDB();
			fake_event.source.groupId = 'Cf30a163d900ea30309e10222eebf5082';
			fake_event.message.text = 'w管理者設定 0 U884c72737969a5e9ddc8581234567890 WayneChang123';

			let idx = await usr_mgr.setGroupMgr(fake_event);
			expect(idx).toEqual(0);
			expect(groupDB[0].mgr_name).toMatch('WayneChang123');
			expect(groupDB[0].mgr_id).toMatch('U884c72737969a5e9ddc8581234567890');
		} catch (err) {
			console.error(err);
			throw err;
		}
	});
});
//////////////////////////////
// 「w群組資訊設定」 指令測試 //
/////////////////////////////
describe('【w群組資訊設定】', () => {
	test('Test for setGroupMgr()-NOT SU_GIDX [w群組資訊設定]', async () => {
		// 無法指定管理者的群組ID
		try {
			fake_event.source.groupId = 'ABCD12345678912345678912341111111';
			fake_event.message.text = 'w群組資訊設定 0 小妹測試空間456 2';
			expect(await usr_mgr.setGroupMgr(fake_event)).toBeNull();
		} catch (err) {
			console.error(err);
		}
	});

	test('Test for setGroupMgr()-command items are NOT enough [w群組資訊設定]', async () => {
		// 無法指定管理者的群組ID
		try {
			// 可以指定管理者的群組ID，但是指令不全(缺項)
			// 只有 'Cf30a163d900ea30309e10222eebf5082'這個群組可以進行管理者相關設定
			fake_event.source.groupId = 'Cf30a163d900ea30309e10222eebf5082';
			fake_event.message.text = 'w群組資訊設定 2';
			expect(await usr_mgr.setGroupMgr(fake_event)).toBeNull();
		} catch (err) {
			console.error(err);
		}
	});

	test('Test for setGroupMgr()-CORRECT command-1 [w群組資訊設定]', async () => {
		try {
			// 可以指定管理者的群組ID，指令正確
			let groupDB = usr_mgr.getGDB();
			fake_event.source.groupId = 'Cf30a163d900ea30309e10222eebf5082';
			fake_event.message.text = 'w群組資訊設定 2 快樂群組 212';

			let idx = await usr_mgr.setGroupMgr(fake_event);
			expect(idx).toEqual(2);
			expect(groupDB[2].gname).toMatch('快樂群組');
			expect(groupDB[2].no_members).toEqual(212);
		} catch (err) {
			console.error(err);
			throw err;
		}
	});

	test('Test for setGroupMgr()-CORRECT command-2 [w群組資訊設定]', async () => {
		try {
			// 可以指定管理者的群組ID，指令正確
			let groupDB = usr_mgr.getGDB();
			fake_event.source.groupId = 'Cf30a163d900ea30309e10222eebf5082';
			fake_event.message.text = 'w群組資訊設定 0 小妹測試空間123 1';

			let idx = await usr_mgr.setGroupMgr(fake_event);
			expect(idx).toEqual(0);
			expect(groupDB[0].gname).toMatch('小妹測試空間123');
			expect(groupDB[0].no_members).toEqual(1);
		} catch (err) {
			console.error(err);
			throw err;
		}
	});

	test('Test for setGroupMgr()-CORRECT command-3 [w群組資訊設定]', async () => {
		try {
			// 可以指定管理者的群組ID，指令正確
			let groupDB = usr_mgr.getGDB();
			fake_event.source.groupId = 'Cf30a163d900ea30309e10222eebf5082';
			fake_event.message.text = 'w群組資訊設定 0 小妹測試空間456 2';

			let idx = await usr_mgr.setGroupMgr(fake_event);
			expect(idx).toEqual(0);
			expect(groupDB[0].gname).toMatch('小妹測試空間456');
			expect(groupDB[0].no_members).toEqual(2);
		} catch (err) {
			console.error(err);
			throw err;
		}
	});
});