var dateFormat = require('dateformat');
var msgpacker = require('../middlewares/msgpacker');

var connections = {
  set: function(key,value){
    if(!this.connections) this.connections = {};
    this.connections[key] = value;
  },
  get: function(key){
    return this.connections[key];
  }
};

function socket(connection){
  connection.on('end', function() {
    console.log('client disconnected');
  });


  //----传输的字节流，在这里是字节流一节节的不能保证一次就是一组完整数据，先校验数据完整性----
  connection.on('data',(chunk) => {
    var ip = connection.remoteAddress;
    connections.set(ip, connection);

    var buffers = [];
    var message = msgpacker.validateIntegrity(chunk,buffers);

    if(!message.integral)
      return;

    var content = message.content;
    console.log("client:发信息过来了->"+JSON.stringify(content));
    var msg = {
        "code":"200",
        "msg":"test",
        "time": dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
      }
    connection.write(msgpacker.packWithType(msg,1));
    // connection.pipe(connection);   //pipe完就调end了
    console.log("发回执回去:"+JSON.stringify(msg));
  });

  //----当一个错误发生时触发。 'close' 事件将直接被下列时间调用----
	connection.on('error', (error) => {
    console.log("ip:"+error);
		connections.remove(ip);

		// console.log('%s %s %s \'s delete socket: ', ip.ip === undefined ? ip : ip.ip,
		// 	ip.Country === undefined ? '' : ip.Country, ip.Area === undefined ? '' : ip.Area);
		// console.log("出队 --> 标识：【%s】, 队列长度：【%s】", userInfo.deviceId, connections.keys.length);
		// console.log('check deleted socket isExsit? ---> ' + connections.get(userInfo.deviceId));

	});
}



module.exports = {
  connections: connections,
  socket: socket
}
