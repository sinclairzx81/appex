
var http  = require('http');

var appex = require('appex');

var app = appex({ program : './program.ts', devmode : true, logging : false });

var server = http.createServer(function(req, res) {

    app(req, res);
});

server.listen(5000);


