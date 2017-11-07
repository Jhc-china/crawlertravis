'use strict';

const mm = require('egg-mock');
const assert = require('assert');

it('Schedule iplimitBan run OK', async () => {
  const app = mm.app();
  await app.ready();
  app.ipBan = { xxx: true };
  app.bucket = { xxx: 1 };
  await app.runSchedule('iplimitBan');
  assert(app.bucket.xxx === app.config.bucket.iptotal, { xxx: app.config.bucket.iptotal });
  assert(app.ipBan, {});
});
