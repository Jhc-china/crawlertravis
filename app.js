'use strict';
// 这个是初始化的一些对象
// ======================================================================
// badip是用于存放恶意访问的ip的
// bucket是每个ip用户的桶，用于存放每个用户的token
// usersUse是用于存放每个用户访问使用的流量的
// usersBan是用于存放那些流量使用超过上限的用户的ip的
// ipBan是用于存放那些token用光了还访问的ip的
module.exports = app => {
  app.beforeStart(async () => {
    app.badip = {};
    app.bucket = {};
    app.usersUse = {};
    app.usersBan = {};
    app.ipBan = {};
  });
};
