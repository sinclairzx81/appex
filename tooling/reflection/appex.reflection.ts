declare var require;

export module appex.reflection {

    var fs = require('fs');

    export function index(context) {
        
        context.response.writeHead(200, {'content-type': 'text/html'});

        var readstream = fs.createReadStream('./examples/reflection/appex.reflection.html');

        readstream.pipe(context.response);
    }

    export function script(context) {
        
        context.response.writeHead(200, {'content-type': 'text/javascript'});

        var readstream = fs.createReadStream('./examples/reflection/appex.reflection.js');

        readstream.pipe(context.response);
    }

    export function data (context, request:any, callback:(response:any)=>void) { 

        callback(context.reflection);
    }
}