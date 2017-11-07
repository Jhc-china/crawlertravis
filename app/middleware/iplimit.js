'use strict';
// 这个中间件的作用是用来限制ip的(非恶意ip)
// ======================================================================
// 前提   1.该ip用户没有因为使用流量超过上限被列入usersBan的列表
//        2.该用户没有恶意访问记录(即badip里面没有他的ip)或者
//        有恶意访问记录，但是恶意访问次数未超上限(options.badip.times)
// ======================================================================
// 判断   1.该ip用户已经被列入了ipban名单(token用完了还访问就会列入ipban名单)
//        那么返回状态码403，返回msg 超过访问次数上限，被ban 30秒
//        2.该ip没有被列入ipban名单，bucket 赋值为该ip在app.bucket中的值
//        (如果该用户是第一次访问，那么app.bucket中该ip对应的值是undefined，是不满足>=0的条件的)
//        如果该用户是第一次访问，则初始化他的token，数量为options.iptotal个
//        如果不是第一次访问，则该ip对应的app.bucket是有值的，每访问一次，对应的token就会减少一个
//        然后判断如果token小于了我预设的下限(options.ipnon)，这里我预设的是0个
//        那么用户就会被列入ipBan名单，下次再访问时，这个中间件就会进入判断条件1
// ======================================================================
module.exports = options => {
  return async (ctx, next) => {
    if (ctx.app.usersBan[ctx.request.ip] !== true) {
      if ((!ctx.app.badip[ctx.request.ip]) || ctx.app.badip[ctx.request.ip] < options.badip.times) {
        if (ctx.app.ipBan[ctx.request.ip]) {
          ctx.status = 403;
          ctx.body = { code: 403, msg: 'Exceed call times limit, and you will be ban for 30 Seconds' };
          // console.log('iplimit-middleware');
          return;
        }
        const bucket = ctx.app.bucket[ctx.request.ip];
        if (bucket >= 0) {
          ctx.app.bucket[ctx.request.ip] = bucket - 1;
          if (bucket <= options.ipnon) {
            ctx.app.ipBan[ctx.request.ip] = true;
          }
          // console.log('iplimit-middleware');
        } else {
          ctx.app.bucket[ctx.request.ip] = options.iptotal;
          // console.log('iplimit-middleware');
        }
      }
    }
    await next();
  };
};
