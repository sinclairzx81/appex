var port = 5444;
var devmode = false;

var appex   = require('appex');

var runtime = appex.runtime ({ source : './program.ts', devmode  : devmode });



require('http').createServer( function(request, response) {
    
    runtime(request, response);
    
}).listen(port);

console.log('server running on ' + port)
