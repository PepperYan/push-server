var express = require('express');
var redisHelper = require('../middlewares/redis-helper-es6');

module.exports = function(app){

  app.get('/', function(req, res, next) {
    console.log('这也行?');
    redisHelper.set("key1",'value1',function(err,reply){
      if(err) console.log("有错误:"+err);
      console.log('插入了~');
      console.log(reply);

      var key1 = redisHelper.get('key1');
      console.log('下面要揭晓结果了~');
      console.log(key1);
    });

    
    // res.render('index', { title: 'Express' });
  });

};
