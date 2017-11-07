'use strict';
// ipbucket是一个定时运行的桶
// ======================================================================
// 如果有人访问我的页面，他就会在app.bucket里面留下他的ip和token(第一次访问的时候会初始化)
// 初始化的时候他的ip是访问的ip，token初始化是10个
// 例如，访问的人ip是127.0.0.1 那么他访问之后，app.bucket = { 127.0.0.1: 10 }
// 这个定时运行的桶，每隔app.config.bucket.increase的时间间隔
// 就会向app.bucket增加token(前提是bucket要非空对象，就是有用户访问这个api)
// 每次增加一个token，如果用户已经有10个了就不会再增加了(我觉得这里的10应该在config里面改为一个可以配置的参数)
// 这样的话，我们可以通过配置app.config.bucket.increase来调整速率
// 通过10来调整上限(应该改为可配置的参数 === app.config.bucket.iptotal)
// ======================================================================
module.exports = app => {
  return {
    schedule: {
      interval: app.config.bucket.increase,
      type: 'worker',
      immediate: true,
      disable: false,
    },

    async task(ctx) {
      try {
        for (const i in app.bucket) {
          if (app.bucket[i] && app.bucket[i] < app.config.bucket.iptotal) { // 已经将10修改为可配置参数了
            app.bucket[i] = app.bucket[i] + 1;
          }
        }
      } catch (e) {
        ctx.logger.error(e);
      }
    },
  };
};
