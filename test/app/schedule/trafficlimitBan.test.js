'use strict';

const mm = require('egg-mock');
const assert = require('assert');

it('Schedule trafficlimitBan run OK', async () => {
  const app = mm.app();
  await app.ready();
  app.usersBan = { xxx: true };
  await app.runSchedule('trafficlimitBan');
  assert(app.usersBan, {});
});
