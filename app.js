var appex = require('appex');

appex.create('./service.ts', function(host) {
    
    console.log(host.routes);

    var output = host.call('/services/customers/remove', 'hello appex');

    console.log(output);
});

//var http = require('http');

//var server = http.createServer(function(req, res) {
//  console.log('handler 1');
//});

//server.on('request', function(req, res) {
//  console.log('handler 2');
//});

//server.listen(8088);
