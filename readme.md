# appex

Create nodejs web services with typescript.

## install

```javascript
npm install appex
```
# overview

appex is a nodejs framework built on top of the TypeScript programming language. appex enables developers to 
create json web services by writing typescript classes. 
 

see below for example.

## example usage



```javascript

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

```
note: the http endpoints are inferred based on module/class/method. 

note: at this stage, all methods accept json data over http post.

```javascript

/// <reference path="node_modules/appex/references/node.d.ts" />
/// <reference path="bin/appex.d.ts" />

var appex = <appex>require('appex');

export module app 
{
    export class Example extends appex.Service 
    {   
        //app/example/synchronous 
        public synchronous(request:any) : any 
        {
            return request; // echo
        }

        //app/example/asynchronous 
        public asynchronous(request:string, callback : (response:string) => void) : void {
            
            callback(request); // echo
            
        }

        //app/example/override 
        public override(request:string, callback : (response:string) => void) : void {
			
            this.response.writeHead(200, {'content-type' : 'text/plain'});

            this.response.write('overriding by not calling the callback.')

            this.response.end();
        }

        //app/example/io 
        public io (request:string, callback : (response:string[]) => void) : void {
			
            var fs = <fs>require('fs');

            fs.readdir('./', (err, contents) => {
                
                callback(contents);

            });
        }
    }    
}

```