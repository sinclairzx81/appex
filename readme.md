# APPEX 

A nodejs web application framework built on top of the TypeScript programming language.  

## install

```javascript

npm install appex

```

## overview

Appex is a nodejs web application framework built on top of the TypeScript programming language. Appex simplifies 
web application development by enabling developers to create/export http endpoints with TypeScript functions, 
as well as being able to generate http interface descriptions directly from TypeScript type annotations. 

## quick start

The following illistrates setting up a appex runtime, and handling requests. 

```javascript

// app.js

var appex   = require('appex');

var runtime = appex.runtime ({ source : './program.ts', devmode : true });

require('http').createServer( function(request, response) {
    
    runtime(request, response);
    
}).listen(5444);

```
The following demonstrates creating http methods.

note: appex requires that http servicable methods be exported with the 'export' keyword. 

note: urls are infered from a functions module scope.

note: the function 'index' act as top level route in the current module scope. 

```javascript

// program.ts

declare var require;

// url: http://localhost:1337/

export function index (context:any): void { 

    context.response.writeHead(200, {'content-type' : 'text/plain'});
    
    context.response.write('home');

    context.response.end(); 
}

// url: http://localhost:1337/about

export function about (context:any): void { 

    context.response.writeHead(200, {'content-type' : 'text/plain'});
    
    context.response.write('about');

    context.response.end();
}

export module services {
    
    // url: http://localhost:1337/services/

    export function index(context:any) : void {
        
        context.response.writeHead(200, {'content-type' : 'text/plain'});
    
        context.response.write('services index');

        context.response.end(); 

    }

    // url: http://localhost:1337/services/dir

    export function dir(context:any, path:string, callback:(contents:string[]) => void) {
        
        require('fs').readdir(path || './', (error, contents) => {
            
            callback(contents);

        });
    }
}

```

## writing http endpoints

Appex supports two types of http endpoints, handlers and json service methods.

### http handlers

A standard request response handler method can be created with the following method signature.

```javascript

export function method(context:any) : void {

	// handle request ...

}

```

### json service methods

Json service methods are http endpoints whose request and responses are POST'ed to them. Json service
methods automatically parse incoming json requests as well as stringify-ing the response. 

A json service method can be created with the following method signature.

```javascript

export function method(context:any, request:string, callback:(response:any) => void) {

	callback(request); // echo

}

```