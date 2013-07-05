var appex   = require('appex');

var runtime = appex.runtime ({ source : './index.ts', devmode  : true });

require('http').createServer( function(request, response) {
    
    runtime(request, response);
    
}).listen(5444);
