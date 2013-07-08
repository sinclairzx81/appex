var port    = 5000;

var devmode = true;

var logging = true;

var http    = require('http');

var appex   = require('appex');

var server  = http.createServer( appex.runtime ( { sourcefile : './program.ts', devmode:true, logging:true } ));

server.listen(port)

console.log('server running on ' + port);


