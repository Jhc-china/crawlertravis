'use strict';
// 这个中间件和iplimit的不同在于，这个是用于限制恶意访问的
// iplimit只是用户爆发性地使用token，导致token小于预设值从而被ban
// 而这个中间件是对于那些恶意地，多次大量使用token的ip
// ======================================================================
// 前提   1.该ip用户没有因为使用流量超过上限被列入usersBan的列表
//        2.该用户的ip因为大量使用token导致小于下限从而列入ipBan列表的
// ======================================================================
// 判断   1.如果该用户是第一次恶意访问，那么他的ip在badip列表中是undefined
//        因此是不满足>=0的条件的，那么初始化他的ip在badip中的值为0(应该初始为1，毕竟恶意访问了一次了)
//        2.如果他的ip在badip中有值，那么这个值加一
//        3.加一之后判断，如果这个用户ip在badip中的值超过了我设置的恶意访问的上限(options.times)
//        那么，这个中间件就会返回状态码429，msg：恶意ip，会被ban 10分钟
// ======================================================================
module.exports = options => {
  return async (ctx, next) => {
    if (ctx.app.usersBan[ctx.request.ip] !== true) {
      if (ctx.app.ipBan[ctx.request.ip] === true) {
        if (ctx.app.badip[ctx.request.ip] >= 0) {
          ctx.app.badip[ctx.request.ip] = ctx.app.badip[ctx.request.ip] + 1;
        } else {
          ctx.app.badip[ctx.request.ip] = 0;
        }
      }
      if (ctx.app.badip[ctx.request.ip] >= options.times) {
        ctx.status = 429;
        ctx.body = { code: 429, msg: ' Malicious IP, You will be ban for 10 minutes' };
        // console.log('badiplimit-middleware');
        return;
      }
      // console.log('badiplimit-middleware');
    }
    await next();
  };
};
