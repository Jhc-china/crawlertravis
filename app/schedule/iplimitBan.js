'use strict';
// 这一个定时任务工作原理是这样的
// ======================================================================
// 定时间隔app.config.iplimit.bantime(即每个ip最多被ban的时间)
// 每隔这么多时间，我就把app.ipBan (被ban掉的用户名单)给清空
// 同时，对于那些被Ban掉的用户，把他们桶里的token重新初始化为app.config.bucket.iptotal这么多
// ======================================================================
module.exports = app => {
  return {
    schedule: {
      interval: app.config.iplimit.bantime,
      type: 'worker',
      immediate: true,
      disable: false,
    },

    async task(ctx) {
      try {
        if (app.ipBan !== {}) {
          for (const i in app.ipBan) {
            app.bucket[i] = app.config.bucket.iptotal;
          }
        }
        app.ipBan = {};
      } catch (e) {
        ctx.logger.error(e);
      }
    },
  };
};
