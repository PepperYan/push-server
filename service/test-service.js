var net = require('net');
var express = require('express');
var msgpacker = require('../middlewares/msgpacker');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  var client = net.connect({port: 8138},
      function() { //'connect' listener
    console.log('client:connected to server!');
    // client.set('bufferSize',1);
    // client.__proto__.bufferSize = 1;
    var pack = msgpacker.packWithType({
      "id":"1",
      "name":"test1"
    },1);
    var tag = client.write(pack);
    console.log("tag:"+tag);
  });
  client.setNoDelay(true);


  client.on('data', function(data) {
    // console.log('client-data:'+data);
    var json = msgpacker.unpack(data);
    // console.log('client-data:unpack'+);
    // console.log('client-data:unpack->'+ JSON.stringify(json));
    // client.end();
  });

  client.on('end', function() {
    console.log('client:disconnected from server');
  });

});

module.exports = router;
