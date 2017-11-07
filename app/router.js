'use strict';

module.exports = app => {
  const iplimit = app.middlewares.iplimit(app.config.bucket);
  const badiplimit = app.middlewares.badiplimit(app.config.bucket.badip);
  const uselimit = app.middlewares.uselimit(app.config.trafficlimit);
  const usecaculate = app.middlewares.usecaculate();
  app.get('/', 'home.index');
  app.get('/countries', iplimit, badiplimit, uselimit, usecaculate, 'country.country');
};

// 应该使用复数形式，毕竟返回的数据不止一条
