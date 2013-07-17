
var http  = require('http');

var appex = require('appex');

var app = appex({ program : './program.ts' });

var server = http.createServer(function(req, res){

    app(req, res); // appex handler...
});

server.listen(3000);


