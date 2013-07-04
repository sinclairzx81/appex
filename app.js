
var appex = require('appex');

// create a appex host.

var host = new appex.Host(server);

// require / compile typescript source file(s). 

host.require('./service.ts', function() { 

    console.log('compiled and ready to go.'); 

});

// simple nodejs http server.

var server = require('http').createServer(function(request, response) {

    response.writeHead(200, { 'content-type' : 'text/plain' });

    response.write('appex web host: \n');
    
    for (var n in host.routes) {

        response.write('--------------------------------------------\n')

        response.write( 'url: ' + host.routes[n].url + '\n' );

        response.write('input type:\n');

        response.write( JSON.stringify(host.routes[n].input, null, ' ') + '\n' );

        response.write('output type:\n');

        response.write( JSON.stringify(host.routes[n].output, null, ' ') + '\n' );
    }
    
    response.end();

}).listen(7777);

// bind appex host to server.

host.bind(server);