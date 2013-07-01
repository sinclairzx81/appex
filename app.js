require('typescript.api').register();
 
var appex = require('appex');

var http  = require('http');


var server = http.createServer(function(req, res){


});

var service = __dirname + '/service.ts';

appex.createServer(service);




 




 

 


