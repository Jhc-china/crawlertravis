'use strict';
// 这个中间件是用来限制用户使用流量的(不完善，因为 流量计算公式or流量统计 我不是很懂)
// ======================================================================
// 基本操作是这样的
// 条件   1. A.用户ip没有被列入ipBan列表(访问次数没有超过上限) 并且
//           B.[用户ip也没有被列入badip列表(不是恶意ip)或者就是被列入badip，只要没有超过恶意访问上限也可以]
// 判断   1. 用户使用的流量(usersUse)是否超过了我设置的上限(options.total)
//        如果超过上限，那么用户ip被列入usersBan列表
//        如果被列入usersBan，中间件就会返回状态码429，msg:使用太多资源啦
// ======================================================================
module.exports = options => {
  return async (ctx, next) => {
    if ((!ctx.app.ipBan[ctx.request.ip]) && ((!ctx.app.badip[ctx.request.ip]) || ctx.app.badip[ctx.request.ip] < options.badip.times)) {
      if (ctx.app.usersUse[ctx.request.ip] > options.total) {
        ctx.app.usersBan[ctx.request.ip] = true;
      }
      if (ctx.app.usersBan[ctx.request.ip] === true) {
        ctx.status = 429;
        ctx.body = { code: 429, msg: ' Use too many(> 2000000 byte) resources in 5s, you will be ban for 15s' };
        // console.log('uselimit-middleware');
        return;
      }
    }
    // console.log('uselimit-middleware');
    await next();
  };
};
