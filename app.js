var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var net = require('net');

var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs',require('./middlewares/hbs-engine'));
app.set('view engine', 'hbs');
app.enable('view cache');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, 'public')));
// app.use('/static', express.static('public'));

(require('./routes/index'))(app)
app.use('/test-service', require('./service/test-service'));
app.use('/client', require('./routes/client'));
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//启动推送服务
var service = require('./service/push-service');
var server = net.createServer(service.socket);
server.listen(8138, function() { //'listening' listener
  console.log('server bound');
});

var http = require('http').Server(app);
var io = require('socket.io')(http);
require('./service/io-service')(io);
http.listen(8139, function(){
  console.log('listening on *:8139');
});

// var server = require('http').createServer();
// var BinaryServer = require('binaryjs').BinaryServer;
// var bs = BinaryServer({server: server});
// require('./service/binary-service')(bs);
// server.listen(9000);
// var WebSocketServer = require('ws').Server,
//     wss = new WebSocketServer({port: 8139});
// require('./service/ws-service')(wss)




server.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(function () {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3333);

module.exports = app;
