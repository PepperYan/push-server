var redis = require('redis');
var Promise = require('bluebird');

function RedisHelper(){
  this.expireTime = 24 * 60 * 60;
  this.client= Promise.promisifyAll(redis.createClient());
}

RedisHelper.prototype.set = function(key,value,callback,expire){
  this.client.setAsync(key,value).then(function(reply){
    if(expire){
      this.client.expireAsync(key,expire);
    }else{
      this.client.expireAsync(key,this.expireTime);
    }
    callback(null,reply);
  }.bind(this))
  .catch(function(err){
    console.err('set报错了:'+err);
    callback(err,null);
  });
}

RedisHelper.prototype.client = function(){
  return this.client;
}

RedisHelper.prototype.get = function(key) {
  this.client.getAsync(key).then(function(reply) {
      return reply;
  })
  .catch(function(err){
    console.err("get报错了:"+err);
  });
}

RedisHelper.prototype.getBuffer = function(key){
  this.client.getAsync(new Buffer(key)).then(function (reply) {
      console.log(reply.toString()); // Will print `<Buffer 4f 4b>`
      return reply;
  })
  .catch(function(err){
    console.err("get报错了:"+err);
  });
}


RedisHelper.prototype.hget = function(hashTable, key, callback) {
  this.client.hgetAsync(hashTable, key).then(function(reply) {
      callback(reply);
  })
  .catch(function(err){
    console.err('hget:'+err);
  });
}

RedisHelper.prototype.hset = function(hashTable, key, value, callback, expire) {
  this.client.hsetAsync(hashTable, key, value).then(function(reply) {
      if (expire && typeof expire === 'number') {
          console.log('key expire: %s', expire);
          this.client.expire(key, expire); // 持久时间
      }else{
          console.log('key expire: ' + this.expireTime);
          this.client.expire(key, that.expireTime); // 持久一天
      }
      callback(null,reply);
  }.bind(this))
  .catch(function(err){
    console.err('hset:'+err);
    callback(err,null);
  });
}

RedisHelper.prototype.hdel = function(hashTable, key, callback) {
  this.client.hdelAsync(hashTable, key).then(function(reply) {
      callback(error, reply);
  })
  .catch(function(err){
    console.err('hdel:'+err);
  });
}

RedisHelper.prototype.close = function(){
  this.client.onAsync('end').then(function() {
    console.log('redis closed.');
  })
  .catch(function(err){
    console.log('redis closed err.');
  });
  client.quit();
}


module.exports = new RedisHelper();
