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
        es6promise: '../vendor/es6-promise/es6-promise.min'
    },
    waitSeconds: 15
});


define(['domReady','msgpack','es6promise'],function(domReady,msgpack,es6promise){
  es6promise.polyfill();

  domReady(function () {

    var exampleSocket = new WebSocket("ws://localhost:8138/", "protocolOne");
  });
})
