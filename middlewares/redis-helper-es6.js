var redis = require('redis');
var Promise = require('bluebird');

class RedisHelper {

  constructor(){
    this.expireTime = 24 * 60 * 60;
    this.client= Promise.promisifyAll(redis.createClient());
    // this.client.onAsync('err').catch(function(err){
    //   console.console.log('err:'+err);
    // })
  }

  set(key,value,callback,expire) {
    this.client.setAsync(key,value).then(function(reply){
      if(expire){
        this.client.expireAsync(key,expire);
      }else{
        this.client.expireAsync(key,this.expireTime);
      }
      callback(null,reply);
    }.bind(this))
    .catch(function(err){
      console.error('set报错了:'+err);
      callback(err,null);
    });
  }


  client() {
    return this.client;
  }

  get(key,callback) {
    console.log('进get了');
    this.client.getAsync(key).then(function(reply) {
        console.log("get返回:"+reply);
        callback(null,reply);
    })
    .catch(function(err){
      console.error("get报错了:"+err);
      callback(err,null);
    });
  }

  getBuffer(key,callback){
    return this.client.getAsync(new Buffer(key)).then(function (reply) {
        console.log(reply.toString()); // Will print `<Buffer 4f 4b>`
        callback(null,reply);
    })
    .catch(function(err){
      console.error("get报错了:"+err);
      callback(err,null);
    });
  }

  hget(hashTable, key, callback) {
    return this.client.hgetAsync(hashTable, key).then(function(reply) {
        callback(null,reply);
    })
    .catch(function(err){
      console.error('hget:'+err);
      callback(null,reply);
    });
  }

  hset(hashTable, key, value, callback, expire) {

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
      console.error('hset:'+err);
      callback(err,null);
    });
  }

  hdel(hashTable, key, callback) {
    this.client.hdelAsync(hashTable, key).then(function(reply) {
        callback(error, reply);
    })
    .catch(function(err){
      console.error('hdel:'+err);
    });
  }

  close() {
    this.client.onAsync('end').then(function() {
      console.log('redis closed.');
    })
    .catch(function(err){
      console.log('redis closed err.');
    });
    client.quit();
  }
}

module.exports = new RedisHelper();
