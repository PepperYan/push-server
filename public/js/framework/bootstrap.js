requirejs.config({
    //By default load any module IDs from js/lib
    // baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        domReady: '../vendor/requirejs-domReady/require-domReady',
        msgpack: '../vendor/msgpack-lite/msgpack.min',
        es6promise: '../vendor/es6-promise/es6-promise.min',
        socketio : '../vendor/socketio/socketio.min',

    },
    shim: {
    },
    waitSeconds: 15
});

var url = "localhost:8139";

define(['domReady','msgpack','es6promise','socketio'],function(domReady,msgpack,es6promise,io){
  es6promise.polyfill();

  domReady(function () {

    // socket = io.connect(url);
    var socket = io(url);
    /*
     * Message on connection
     */
    socket.on('connect', function() {
      console.log("connect")
    });
    /*
     * Message from socket.io
     */
    socket.on('message', function(data) {
      console.log("message")
    });
    //  exampleSocket('8139');
    //  window.exampleSocket = exampleSocket;
    //
    //  function exampleSocket(port){
    //   var exampleSocket = new WebSocket("ws://localhost:"+port+"/");
    //
    //   exampleSocket.onopen = function (event) {
    //     console.log("opened");
    //     // exampleSocket.send("Here's some text that the server is urgently awaiting!");
    //   };
    //
    //   exampleSocket.onmessage = function (event) {
    //     console.log('onmessage')
    //     console.log(event.data);
    //   }
    //   exampleSocket.onclose =function(){
    //     console.log('closed');
    //   }
    //   exampleSocket.onerror = function(){
    //     console.log('error');
    //   }
    // }

  });
})
