var http  = require('http');

var fs    = require('fs');

var server = http.createServer(function(request, response) {
    
    if (request.url == '/') {

        response.writeHead(200, {'content-type' : 'text/html'});

        var readstream = fs.createReadStream('./client/client.html');

        readstream.pipe(response);

        return;
    }

    if (request.url == '/client.js') {

        response.writeHead(200, {'content-type' : 'text/javascript'});

        var readstream = fs.createReadStream('./client/client.js');

        readstream.pipe(response);
        return;
    }

    if (request.url == '/client.css') {

        response.writeHead(200, {'content-type' : 'text/css'});

        var readstream = fs.createReadStream('./client/client.css');

        readstream.pipe(response);

        return;
    }

    response.writeHead(404, {'content-type' : 'text/plain'});

    response.write('page not found')

    response.end();
});

console.log('started on 5555');

server.listen(5555);

var appex = require('appex');

appex.host('./service.ts', function(host) {
   
    console.log('service loaded')
    
    console.log(JSON.stringify(host.meta, null, ' '));

    host.discovery = true;
    
    host.bind(server);
});


