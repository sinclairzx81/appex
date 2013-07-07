![](https://raw.github.com/sinclairzx81/appex/master/assets/logo.jpg)

### nodejs web apps with [typescript](http://www.typescriptlang.org/)

```javascript
export module app.services {

	// http://[host]:[port]/app/services/message
	export function message(context) {

		context.response.write('hello world!!');

		context.response.end();
	}
}
```
### install

```javascript
npm install appex
```

* [overview](#overview)
* [getting started](#getting_started)
	* [the appex runtime](#runtime)
	* [runtime options](#options)
	* [binding to an http server](#http_server)
	* [binding to an express instance](#express_server)
* [creating services with typescript](#creating_services)
	* [appex context](#appex_context)
	* [appex http handlers](#appex_http_handlers)
	* [appex json handlers](#appex_json_handlers)
	* [index functions](#index_functions)
	* [wildcard functions](#wildcard_functions)
	* [exporting functions](#exporting_functions)
	* [routing functions](#routing_functions)
	* [handling 404](#handling_404)
* [developing with appex](#developing_with_appex)
	* [development mode](#development_mode)
	* [structuring projects](#structuring_projects)
* [additional resources](#resources)

<a name="overview" />
## overview

appex is a nodejs web service framework built on top of the TypeScript programming language. appex 
enables nodejs developers to expose typescript functions as http endpoints as well as generate meaningful service
meta data for clients to consume.

appex also provides a dynamic compilation environment for typescript to aid in development. appex will effeciently 
manage compilation in the background without the need to restart the web server, or use additional modules.

appex is designed to operate as both a standalone web service solution or as a complement to existing applications
written in frameworks such as express / connect that wish to extend their projects with typed web api's. 

<a name="getting_started" />
## getting started

The following sections outline configuring appex.

<a name="runtime" />
### the appex runtime

The appex runtime is compilation engine that handles dynamic compilation, route mapping and function 
invocation. appex provides a simple utility method for setting up the runtime, as described below.

```javascript
var http    = require('http');

var appex   = require('appex');

// create the runtime.
var runtime = appex.runtime ( { sourcefile : './program.ts' } ); 

// bind to the http server.
var server  = http.createServer( runtime ); 

server.listen(3000);
```

The appex.runtime() method returns a http handler function which is both compatable with nodejs' 
http server as well as connect middleware. This is the recommended approach of creating runtimes, 
However, if you need to access the runtime directly or are simply curious, you can also setup 
the runtime as follows..

```javascript
var http    = require('http');

var appex   = require('appex');

var runtime = new appex.Runtime ( { sourcefile : './program.ts' } );

var server  = http.createServer( function(req, res) {
    
	console.log(runtime); // investigate the runtime.

    runtime.request_handler(req, res, function() { 

		// request was not handled...

	});  
});

server.listen(3000)
```

<a name="options" />
### runtime options

The appex runtime accepts the following options.

```javascript
var options = { 

	sourcefile : './program.ts', // (required) location of source file.

    devmode    : true,           // (optional) recompile on request. 

    logging    : true,           // (optional) write requests to stdout.

	stdout     : process.stdout, // (optional) output stream. default is process.stdout

	stderr     : process.stderr, // (optional) error  stream. default is process.stderr
};

var runtime = appex.runtime ( options );
```

<a name="http_server" />
### binding to an http server

Setting up appex on a nodejs http server.

```javascript
//----------------------------------------------
// file: program.ts
//----------------------------------------------

export function index (context) { 
		
	context.response.write('hello world');

	context.response.end(); 
}


//----------------------------------------------
// file: app.js
//----------------------------------------------

var http    = require('http');

var appex   = require('appex');

var runtime = appex.runtime ( { sourcefile : './program.ts' } );

var server  = http.createServer( runtime );

server.listen(3000);
```
<a name="express_server" />
### binding to an express instance

The following illistrates setting up appex on an express instance.

```javascript
//----------------------------------------------
// file: program.ts
//----------------------------------------------

// http://localhost:3000/about
export function about (context) { 

	context.response.write('about page');

	context.response.end(); 
}


//----------------------------------------------
// file: app.js
//----------------------------------------------

var express = require('express');

var appex   = require('appex');

var app = express();

app.use( appex.runtime ( { sourcefile : './program.ts' } ) );

app.get('/', function(req, res) {

  res.send('Hello World');
  
});

app.listen(3000);
```

<a name="creating_services" />
## creating services with typescript

appex enables developers to write http endpoints by writing typescript functions. 

The following section describes how to write http accessible functions. 

<a name="appex_context" />
### appex context

All appex functions are passed a context object as the first argument. The context object encapulates
the http request and response objects issued by the underlying http server, as well as
additional objects specific to appex. These are listed below:

```javascript
// the context object
export function method(context) {
	
	// context.request    - the http request object.

	// context.response   - the http response object.

	// context.reflection - appex runtime type information.

	// context.routes     - appex routing tables.

	// context.exports    - appex module exports handles.

	// context.mime       - appex mime utility.
}
```

<a name="appex_http_handlers" />
### appex http handlers

A appex http handler is defined with the following signature.

* argument[0] - the appex context
* returns     - void (optional)

http handler functions need to complete the http request.

```javascript

// url: http://[host]:[port]/method
export function method(context) : void {

	context.response.write('hello world');
	
	context.response.end();
}
```

<a name="appex_json_handlers" />
### appex json handlers

A appex json handler is a function suited to handling json based http requests. appex json handlers
are invoked via HTTP POST and expect JSON to be submitted with the request. POSTing null or invalid
JSON results in the request argument being null.

A appex json handler requires the following signature.

* argument[0] - the appex context
* argument[1] - A optionally typed json request object. 
* argument[2] - a optionally typed typescript callback with a single argument for the object response.
* returns     - void (optional) 

The return type is optional. json handler functions "must" invoke the callback to complete the request.

```javascript
export function method(context, request, callback:(response) => void) : void {

	callback(request); // echo

}
```

<a name="index_functions" />
### index functions

appex denotes that functions named 'index' resolve to the current module scope. As demonstrated below: 

```javascript
// url: http://[host]:[port]/
export function index(context) { }

export module blogs {
	
	// url: http://[host]:[port]/blogs
	export function index  (context) { }
	
	// url: http://[host]:[port]/blogs/submit
	export function submit (context) { }
}
```
<a name="wildcard_functions" />
### wildcard functions

appex supports url wildcard routing by way of wildcard functions. Wildcard functions are special in the regard 
they support more than one argument (other than the context) for which url parameters will be mapped.

appex currently supports the type 'any' (or none), string and number type annotations on wildcard arguments. 
if a wildcard argument specifies any other type, the wildcard function will not be routed. 

if no type annotation is specified, appex will pass a string value.

```javascript
export module blogs {
    
	// url : http://[host]:[port]/blogs
    export function index (context) { /* handle request */ }
	
	// http://[host]:[port]/blogs/submit
	export function submit (context) { /* handle request */ }
	
	// url : http://[host]:[port]/blogs/2013/1/11  - matched
	// url : http://[host]:[port]/blogs/2013/01/11 - matched
	// url : http://[host]:[port]/blogs/cat/01/11  - not matched
    export function wildcard(context, year:number, month:number, day:number) {

        context.response.write('blogs ' + year + ' ' + month + ' ' + day)

        context.response.end(); 
    }
}
```

note: wildcard functions should be declared last in any module scope. this ensures other routes
will be matched first.

<a name="exporting_functions" />
### exporting functions

appex extends TypeScripts concept of visibility to include visibility over http. From this
developers and control which functions are exported as http endpoints.  

In order to make a function accessible over http, you must explicitly "export" the function. 

consider the following example:

```javascript

// module is not exported, and is therefore private.
module private_module {
	
	// function is exported, yet private as a http endpoint due to the 
	// parent module being private.
	export function public_method () { }
	
	// function is not exported, and is private to this module.
	function private_method() { }
}

// function is not exported, and is therefore private.
function private_function() { }

// function is exported, and therefore publically accessible.
export function public_function   (context) { 
	
	// this function can invoke private functions.
	private_function(); // ok
	
	// calling exported method in private module
	private_module.public_method(); // ok

	// calling non exported method in private module
	// private_module.private_method(); // bad

	context.response.write('testing');
	context.response.end();
}
```

<a name="routing_functions" />
### routing functions

appex creates routes based on module scope and function name. consider the following:

```javascript

// url: http://[host]:[port]/
export function index   (context:any) { }

// url: http://[host]:[port]/about
export function about   (context:any) { }

// url: http://[host]:[port]/contact
export function contact (context:any) { }

export module services.customers {
	
	// url: http://[host]:[port]/services/customers/insert
	export function insert(context:any) : void { }
	
	// url: http://[host]:[port]/services/customers/update
	export function update(context:any) : void { }
	
	// url: http://[host]:[port]/services/customers/delete
	export function delete(context:any) : void { }
}
```

<a name='handling_404' />
### handling 404

Use wildcard functions to catch unhandled routes.

```javascript
// http:[host]:[port]/
export function index   (context) { 
	context.response.writeHead(404, {'content-type' : 'text/plain'});
	context.response.write('home page');
	context.response.end();
}

// http:[host]:[port]/(.*)
export function wildcard(context, path) {
	context.response.writeHead(404, {'content-type' : 'text/plain'});
	context.response.write(path + ' page not found');
	context.response.end();
}
```

<a name="developing_with_appex" />
## developing with appex

appex enables nodejs developers to write applications in pure TypeScript. The following
section outlines how to effeciently develop with appex and the TypeScript programming language.

<a name="development_mode" />
### development mode

```javascript 
// enable compilation on request with the devmode option.
var runtime = appex.runtime ({ sourcefile : './program.ts', 
							   devmode    : true, 
							   logging    : true }); 

```
appex is built directly on top of the Microsoft TypeScript 0.9 compiler and leverages it for tight
integration with the nodejs platform. By enabling the 'devmode' option on a appex runtime, appex 
will rebuild your source code on each request made to the server. 

appex achieves performance in this regard by leveraging features available in
TypeScript compiler which facilitate incremental building / caching of typescript 
compilation units. request compilation in devmode typically take tens of milliseconds 
to complete for modest size projects.

In addition to this, compilations are run as a background worker process to ensure they 
do not interupt requests being served on the parent process. 

appex will output syntax and type errors to the runtime stdout as well as the http response. 
Syntax errors will not bring down the web process. And you won't need to restart on code 
updates.

<a name="structuring_projects" />
### structuring projects

appex includes TypeScript's ability to reference source files with the 'reference' element. appex 
will traverse each source files references and include it as part of the compilation.

Developers can use this functionality to logically split source files into reusable components of
functionality, as demonstrated below. 

```javascript
//---------------------------------------------------	
// file: app.js
//---------------------------------------------------

var appex = require('appex');

var runtime = appex.runtime ({ sourcefile : './index.ts' });

require('http').createServer( runtime  ).listen(3000);

//---------------------------------------------------	
// file: index.ts
//---------------------------------------------------

/// <reference path="pages.ts" />
/// <reference path="users.ts" />

//---------------------------------------------------	
// file: pages.ts
//---------------------------------------------------

// http://[host]:[port]/
export function index   (context) { /* handle request */ }

// http://[host]:[port]/about
export function about   (context) { /* handle request */ }

// http://[host]:[port]/contact
export function contact (context) { /* handle request */ }

//---------------------------------------------------	
// file: users.ts
//---------------------------------------------------

export module users {
	
	// http://[host]:[port]/users/login
	export function login  (context) { /* handle request */ }
	
	// http://[host]:[port]/users/logout
	export function logout (context) { /* handle request */ }
}

```

<a name="resources" />
## additional resources

* [typescript homepage](http://www.typescriptlang.org/)
* [typescript language specification](http://www.typescriptlang.org/Content/TypeScript%20Language%20Specification.pdf)
* [typescript declarations repository](https://github.com/borisyankov/DefinitelyTyped)
