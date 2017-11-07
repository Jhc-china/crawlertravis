'use strict';
// 这个定时任务就很简单了
// ======================================================================
// 每隔app.config.bucket.badip.bantime (对于恶意访问的ip === 就是这个ip在我的badip.bantime时间里面超过恶意访问次数上限)
// 这个上限是可配置的，我设置的是10 (配置的参数是app.config.bucket.bad.times)
// 然后这个ip被ban的时间就远远大于iplimitBan啦 (搞事情肯定是要负责的)
// 这个定时任务是用于解放那些恶意访问的ip的 (宽容一下)
// ======================================================================
module.exports = app => {
  return {
    schedule: {
      interval: app.config.bucket.badip.bantime,
      type: 'worker',
      immediate: true,
      disable: false,
    },

    async task(ctx) {
      try {
        app.badip = {};
      } catch (e) {
        ctx.logger.error(e);
      }
    },
  };
};
