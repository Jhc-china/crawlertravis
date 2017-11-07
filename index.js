'use strict';

require('egg').startCluster({
  baseDir: __dirname,
  // 应用的代码目录
  port: process.env.PORT || 3001,
  // 就是PORT
  workers: 1,
  // app的worker的数量
});
