'use strict';

const mm = require('egg-mock');
const assert = require('assert');

it('Schedule ipBucket run OK', async () => {
  const app = mm.app();
  await app.ready();
  app.bucket = { xxx: 1 };
  await app.runSchedule('ipBucket');
  assert(app.bucket.xxx === 2, { xxx: 2 });
});
