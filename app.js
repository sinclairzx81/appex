var port    = 5444;

var devmode = true;

var logging = true;

var http    = require('http');

var appex   = require('appex');

var runtime = new appex.Runtime ( { sourcefile : './program.ts' } );

var server  = http.createServer( function(req, res) {
    
    runtime.request_handler(req, res)    

});

server.listen(port)

console.log('server running on ' + port);

 
