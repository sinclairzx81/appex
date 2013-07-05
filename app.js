var appex   = require('appex');

var runtime = appex.runtime ({ source : './index.ts', devmode  : false });

require('http').createServer( function(request, response) {
    
    runtime(request, response);
    
}).listen(5444);
