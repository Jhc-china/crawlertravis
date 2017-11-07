'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/country.test.js', () => {
  it('no query should get all', async () => {
    return app.httpRequest()
      .get('/countries')
      .expect(200)
      .then(response => {
        assert(response.body.CHINA);
        assert(response.body.JAPAN);
      });
  });

  it('filter should work OK', async () => {
    return app.httpRequest()
      .get('/countries?find=cnname,telnum')
      .expect(200)
      .then(response => {
        assert(response.body.CHINA.CNname);
        assert(response.body.CHINA.countryTelnum);
        assert(response.body.CHINA.ENname === undefined);
      });
  });
  // 中文cnname会有问题，validate会失败，即使我用了String.fromCodePoint()转化UTF-8的字符也有问题
  it('country can be found via cnname', async () => {
    return app.httpRequest()
      .get('/countries?cnname=%E4%B8%AD%E5%9B%BD')
      .expect(200)
      .then(response => {
        assert(response.body.CHINA);
        assert(!response.body.JAPAN);
      });
  });

  it('country can be found via enname', async () => {
    return app.httpRequest()
      .get('/countries?enname=CHINA')
      .expect(200)
      .then(response => {
        assert(response.body.CHINA);
        assert(!response.body.JAPAN);
      });
  });

  it('country can be found via short', async () => {
    return app.httpRequest()
      .get('/countries?short=CN')
      .expect(200)
      .then(response => {
        assert(response.body.CHINA);
        assert(!response.body.JAPAN);
      });
  });

  it('country can be found via telnum', async () => {
    return app.httpRequest()
      .get('/countries?telnum=86')
      .expect(200)
      .then(response => {
        assert(response.body.CHINA);
        assert(!response.body.JAPAN);
      });
  });

  it('country can be found via num', async () => {
    return app.httpRequest()
      .get('/countries?num=156')
      .expect(200)
      .then(response => {
        assert(response.body.CHINA);
        assert(!response.body.JAPAN);
      });
  });
});
