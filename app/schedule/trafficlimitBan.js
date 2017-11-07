'use strict';
// 这两个对于访问流量的我不是很清楚
// ======================================================================
// 因为对于流量的计算我不清楚(希望大佬帮忙解释下具体怎么做)
// 这个定时任务很简单，每隔app.config.trafficlimit.bantime
// 我把因为流量使用超过上限的用户解放出来(流量上限配置是在app.config.trafficlimit.total配置)
// ======================================================================
module.exports = app => {
  return {
    schedule: {
      interval: app.config.trafficlimit.bantime,
      type: 'worker',
      immediate: true,
      disable: false,
    },

    async task(ctx) {
      try {
        app.usersBan = {};
      } catch (e) {
        ctx.logger.error(e);
      }
    },
  };
};
