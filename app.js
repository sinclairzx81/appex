var appex   = require('appex');

var http    = require('http');

var runtime = appex.runtime({source : './service.ts', devmode : true})

var server  = http.createServer( runtime );

server.listen(7777);

console.log('server runnning on port 7777')