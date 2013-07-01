require('typescript.api').register();

 
var appex = require('appex');

var server = appex.createServer(__dirname + '/service.ts');

server.listen(1234);




 

 


