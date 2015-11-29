var msgpacker = require('./msgpacker');

var connections = {
  set: function(key,value){
    if(!this.connections) this.connections = {};
    this.connections[key] = value;
  },
  get: function(key){
    return this.connections[key];
  }
};

var handler = {
  receive : (message) => {
    var content = message.content;
    console.log("client:发信息过来了->"+JSON.stringify(content));
    var msg = {
        "code":"200",
        "msg":"test",
        "time": dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
      }
    // connection.pipe(connection);   //pipe完就调end了
    console.log("发回执回去:"+JSON.stringify(msg));
    return msg
  },
  receiveWS: (socket,message) => {
    //
  }
}
module.exports = handler;
