'use strict';
// ======================================================================
// 这个也是流量控制的，同trafficlimitBan一样，对于流量控制我还是不是很清楚
// 这个是每隔app.config.trafficlimit.duration，把每隔用户已经使用的流量清空
// 访问的用户也顺便清空了(意思就是在duration期间最多使用app.config.trafficlimit.total的流量)
// ======================================================================
module.exports = app => {
  return {
    schedule: {
      interval: app.config.trafficlimit.duration,
      type: 'worker',
      immediate: true,
      disable: false,
    },

    async task(ctx) {
      try {
        app.usersUse = {};
      } catch (e) {
        ctx.logger.error(e);
      }
    },
  };
};
