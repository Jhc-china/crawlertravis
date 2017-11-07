'use strict';

module.exports = app => {
  class CountryController extends app.Controller {
    filter(value) {
      const beforeparse = value.split(',');
      const parsevalue = { _id: false };
      for (let i = 0; i < beforeparse.length; i++) {
        parsevalue[app.config.transfer[beforeparse[i]]] = true;
      }
      return parsevalue;
    }
    // filter用于过滤反馈的信息，query find后面的字符，如:cnname,enname，作为输入(value)
    // 之前用的是+号，因为解析的问题，URLDecoder会把+解析为空格，为了消除不一致行为，我改为逗号分隔
    // split后的字符数组经过解析(用foreach是不是更好些?)，再返回解析后的值，作为find的过滤选项
    // 传入ctx.model.Country.find({},{})的第二个参数中
    async country() {
      const { ctx } = this;
      const whole = await ctx.model.Country.find({}, { _id: false }); // you should use upper case to access mongoose model
      // 先找数据库里面所有的数据，除去id属性
      const num = whole.length;
      // num:总数据的数量
      const cnRouter = [ 'All' ]; // 路由中cnname必须只能是这些字符
      const enRouter = [ 'All' ]; // 路由中enname必须只能是这些字符
      const shortening = [ 'All' ]; // 路由中short必须只能是这些字符
      const countryNum = [ 'All' ]; // 路由中num必须只能是这些字符
      const countryTelnum = [ 'All' ]; // 路由中telnum必须只能是这些字符
      for (let i = 0; i < num; i++) {
        cnRouter[i + 1] = whole[i].CNname;
        enRouter[i + 1] = whole[i].ENname;
        shortening[i + 1] = whole[i].Shortening;
        countryNum[i + 1] = whole[i].countryNum;
        countryTelnum[i + 1] = whole[i].countryTelnum;
      }
      // 把数据库中的字符加到validate的里面
      ctx.validate({
        cnname: {
          required: false,
          type: 'enum',
          values: cnRouter,
        },
        enname: {
          required: false,
          type: 'enum',
          values: enRouter,
        },
        short: {
          required: false,
          type: 'enum',
          values: shortening,
        },
        num: {
          required: false,
          type: 'enum',
          values: countryNum,
        },
        telnum: {
          required: false,
          type: 'enum',
          values: countryTelnum,
        },
      }, ctx.query);
      // ctx.validate

      const output = {};
      // 初始的output是空对象
      if (ctx.query.find) {
      // 如果我query里面有find，就根据find的值返回所有的城市，但是只返回需要的参数
        const find = this.filter(ctx.query.find);
        const whichvalue = await ctx.model.Country.find({}, find);
        for (let i = 0; i < whichvalue.length; i++) {
          output[whole[i].ENname] = whichvalue[i];
        }
      } else {
      // 没有的话，返回所有的城市，所有的参数
        const allvalue = await ctx.model.Country.find({}, { _id: false });
        for (let i = 0; i < allvalue.length; i++) {
          output[whole[i].ENname] = allvalue[i];
        }
      }
      // 然后再根据查询条件，进行查询，如果我是通过enname确定我要找的城市的
      // 就删除output中那些enname不满足我的enname的城市
      if (ctx.query.enname && ctx.query.enname !== 'All') {
        for (const i in output) {
          for (const j in whole) {
            if (i === whole[j].ENname) {
              if (ctx.query.enname !== whole[j].ENname) {
                delete output[i];
              }
            }
          }
        }
      }
      // 同理，删除cnname不满足我的cnname的城市
      if (ctx.query.cnname && ctx.query.cnname !== 'All') {
        for (const i in output) {
          for (const j in whole) {
            if (i === whole[j].ENname) {
              if (ctx.query.cnname !== whole[j].CNname) {
                delete output[i];
              }
            }
          }
        }
      }
      // 同理，删除shortening不满足我的short的城市
      if (ctx.query.short && ctx.query.short !== 'All') {
        for (const i in output) {
          for (const j in whole) {
            if (i === whole[j].ENname) {
              if (ctx.query.short !== whole[j].Shortening) {
                delete output[i];
              }
            }
          }
        }
      }
      // 同理，删除countrynum不满足我的num的城市
      if (ctx.query.num && ctx.query.num !== 'All') {
        for (const i in output) {
          for (const j in whole) {
            if (i === whole[j].ENname) {
              if (ctx.query.num !== whole[j].countryNum) {
                delete output[i];
              }
            }
          }
        }
      }
      // 同理，删除countrytelnum不满足我的telnum的城市
      if (ctx.query.telnum && ctx.query.telnum !== 'All') {
        for (const i in output) {
          for (const j in whole) {
            if (i === whole[j].ENname) {
              if (ctx.query.telnum !== whole[j].countryTelnum) {
                delete output[i];
              }
            }
          }
        }
      }
      // 处理完后，再把我的output赋给ctx.body
      ctx.body = output;
      // res.body的content-length在koa2中可以通过ctx.length来获取
      // 而对于res.header的大小，是基本不会变的(286~288B)，因此我就取了个中间值
      // 最终用户使用的流量是以 B 来计算的
      // 用户流量计算暂时放在controller下面，因为对于controller之后的中间件是没有效果的
      // 而每次用户使用的流量是要发出GET请求才能有的
      // 最新的流量统计已经作为中间件的形式，放在了usecaculate里面
    }
  }
  return CountryController;
};
