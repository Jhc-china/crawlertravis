'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1508398797554_4298';

  // add your config here
  config.middleware = [];

  config.bucket = {
    iptotal: 10, // 分给每个用户的初始token，增加会使每个用户可访问的次数增加，反之，减少
    ipnon: 0, // 用户token的下限，低于这个值，再访问就会被ban掉
    increase: 1000, // 每个用户每隔 1000 毫秒 加一个token，增加此值，会减少每个用户token增长速率，从而变相限制访问速度
    badip: {
      times: 10, // 用户被ban超过这么多次，会被列入恶意访问名单，增加此值可以增加每个用户允许被ban的次数
      bantime: 600000, // 用户因为恶意访问导致被ban的时间，理论上应该远远大于每次因为token被耗光被ban的时间
    },
  };

  config.iplimit = {
    bantime: 30000, // 用户因为token耗光仍然访问所被ban掉的时间，30000 单位 毫秒(1/1000秒)
  };

  config.trafficlimit = {
    duration: 5000, // 流量限制时间，每duration间隔清空用户使用的流量， 5000 单位 毫秒(1/1000秒)
    total: 2000 * 1024, // 用户在duration期间最多能够使用的流量, 2000 单位 KB(1024B)
    bantime: 15000, // 用户如果使用流量超过上限，被Ban的时间，15000 单位 毫秒(1/1000秒)
  };

  config.mongoose = {
    url: 'mongodb://127.0.0.1/mytest', // 数据库的位置，在我本地的电脑是在127.0.0.1:27017/mytest上
    options: {},
  };

  config.transfer = { // 这个配置是用来进行filter的参数转换的，用于和数据库的内容对应
    enname: 'ENname',
    cnname: 'CNname',
    short: 'Shortening',
    num: 'countryNum',
    telnum: 'countryTelnum',
  };
  return config;
};
