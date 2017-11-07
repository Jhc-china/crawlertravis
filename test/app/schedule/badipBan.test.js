'use strict';

const mm = require('egg-mock');
const assert = require('assert');

it('Schedule badipBan run OK', async () => {
  const app = mm.app();
  await app.ready();
  app.badip = { xxx: 1 };
  await app.runSchedule('badipBan');
  assert(app.badip, {});
});
