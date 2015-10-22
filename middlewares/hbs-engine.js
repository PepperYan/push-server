var exphbs = require('express-handlebars');
var beautify = require('js-beautify').js_beautify;

var hbs = exphbs.create({
  defaultLayout: null,
  extname: '.hbs',
  helpers:{
    stringify: function(obj){
      JSON.stringify(obj);
    },
    beautify: function(obj){
      if(typeof(obj) == "string")
        beautify(obj);
      else
        beautify(JSON.stringify(obj));
    },
    ifProduction: function(options){
      if(process.env.NODE_ENV=='production')
        options.fn(this);
      else
        options.inverse(this);
    }
  }
});

module.exports = hbs.engine
