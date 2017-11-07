'use strict';

const mm = require('egg-mock');
const assert = require('assert');

it('Schedule trafficlimitDuration run OK', async () => {
  const app = mm.app();
  await app.ready();
  app.usersUse = { xxx: 5 };
  await app.runSchedule('trafficlimitDuration');
  assert(app.usersUse, {});
});
