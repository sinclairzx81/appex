var port    = 5444;

var devmode = true;

var logging = true;

var http    = require('http');

var appex   = require('appex');

 

var runtime = new appex.Runtime ( { sourcefile : './program.ts', devmode:false, logging:true } );

var server  = http.createServer( function(req, res) {
    
    runtime.request_handler(req, res, function(){
        
        res.write('not found')    

        res.end();
    })    

});

server.listen(port)

//console.log('server running on ' + port);

 
