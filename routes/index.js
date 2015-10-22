var express = require('express');

module.exports = function(app){

  app.get('/', function(req, res, next) {
    console.log('这也行?');
    res.render('index', { title: 'Express' });
  });

};
