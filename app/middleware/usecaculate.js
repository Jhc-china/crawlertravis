'use strict';
// 这个中间件是用来统计用户目前使用的流量的
// ======================================================================
// 基本操作是这样的
// 条件   按照我的中间件的设置顺序(egg.js基于Koa2)
//        该中间件执行的顺序是按照iplimit->badiplimit->uselimit->controller->本中间件
//        因为最终的流量统计是放在await next()之后的
//        因此，流量统计可以不用放在controller里面
// ======================================================================
module.exports = () => {
  return async (ctx, next) => {
    await next();
    const contentSize = ctx.length;
    const headerSize = 287;
    if (ctx.app.usersUse[ctx.request.ip]) {
      ctx.app.usersUse[ctx.request.ip] += contentSize + headerSize;
    } else {
      ctx.app.usersUse[ctx.request.ip] = contentSize + headerSize;
    }
    // console.log('the data you have used is ' + ctx.app.usersUse[ctx.request.ip] + 'B');
  };
};
