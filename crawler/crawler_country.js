'use strict';

const superagent = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const MongoClient = require('mongodb').MongoClient;
const htmlUrl = 'http://www.resgain.net/country.html';
const DB_CONN_STR = 'mongodb://localhost:27017/test';

const insertData = function(db, data) {
  const collection = db.collection('country');
  collection.insert(data, function(err) {
    if (err) {
      console.log('Error:' + err);
      return;
    }
  });
};

const getHtml = function() {
  return new Promise((resolve, reject) => {
    superagent
      .get(htmlUrl)
      .end((err, res) => {
        if (err) reject(console.log('出错啦'));
        if (res === undefined) return;
        if (res.statusCode === 200) {
          const data = res.text;
          console.log('网页抓取成功...');
          resolve(data);
        }
      });
  });
};

const parseHtml = async function() {
  const data = [];
  const html = await getHtml();
  const $ = cheerio.load(html);
  const country_table = $('.table.table-hover');
  const country_info = country_table.children('tbody').children('tr');

  country_info.each(function(idx, ele) {
    data[idx] = { ENname: ele.childNodes[1].childNodes[0].data,
      CNname: ele.childNodes[5].childNodes[0].data,
      Shortening: ele.childNodes[3].childNodes[0].data,
      countryNum: ele.childNodes[11].childNodes[0].data,
      countryTelnum: ele.childNodes[13].childNodes[0].data,
    };
  });
  console.log('信息爬取完成...');
  return data;
};

const dbInput = async function() {

  let concurrencyCount = 0;
  const data = await parseHtml();
  console.log('开始插入数据...');
  const q = async.queue(function(data, callback) {
    const delay = parseInt((Math.random() * 30000000) % 1000, 10); // 设置延时并发插入
    concurrencyCount++;
    console.log('现在的并发数是', concurrencyCount, '，正在插入的是', data.CNname, '延迟', delay, '毫秒');
    MongoClient.connect(DB_CONN_STR, function(err, db) {
      insertData(db, data);
      if (err) {
        console.log(err);
        callback(null);
      } else {
        setTimeout(() => {
          concurrencyCount--;
          callback(null);
        }, delay);
      }
    });
  }, 10);
  // 当所有任务都执行完以后，将调用该函数
  q.drain = function() {
    console.log('所有数据插入完成...');
  };
  q.push(data);// 将所有任务加入队列

  /* 
const data = await parseHtml();
  for(let i = 0; i < data.length; i++) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
      insertData(db, data[i], function(result) {
        console.log(result);
      });
    });
  }
*/
};

dbInput();
