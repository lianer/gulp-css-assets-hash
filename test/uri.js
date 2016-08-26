var path = require('path');
var URI = require('urijs');

var url = 'http://img.guahao.com/a.png?_=f7ea79f';

var uri = new URI(url);

uri.setQuery({"_": 123})

console.log(uri.is('relative'));