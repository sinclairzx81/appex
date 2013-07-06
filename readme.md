![](https://raw.github.com/sinclairzx81/appex/master/assets/logo.jpg)

### develop nodejs web services with [typescript](http://www.typescriptlang.org/)

## install

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
	* [appex signatures](#appex_signatures)
	* [exporting functions](#exporting_functions)
	* [routing functions](#routing_functions)
	* [index functions](#index_functions)
* [developing with appex](#developing_with_appex)
	* [development mode](#development_mode)
	* [structuring projects](#structuring_projects)
* [additional resources](#resources)

<a name="overview" />
## overview

Appex is a nodejs web service framework built on top of the TypeScript programming language. Appex 
enables nodejs developers to expose typescript functions as http endpoints as well as generate meaningful service
meta data for clients to consume.

Appex also provides a dynamic compilation environment for typescript to aid in development. Appex will effeciently 
manage compilation in the background without the need to restart the web server, or use addition modules.

Appex is designed to operate as both a standalone web service solution or a compliment an existing applications written
in frameworks such as express / connect.

Appex makes writing http endpoints as easy as writing a functions. 

<a name="getting_started" />
## getting started

The following outlines setting the Appex runtime. 

<a name="runtime" />
### the appex runtime

The Appex runtime is compilation engine that handles compiling typescript code, mapping routes to functions and 
invocation. Appex provides a utility method to setting for setting up the runtime, as described below.

```javascript
var http    = require('http');

var appex   = require('appex');

var runtime = appex.runtime ( { sourcefile : './program.ts' } );

var server  = http.createServer( runtime );

server.listen(3000);
```

The appex.runtime() method returns a http handler function which is both compatable with nodejs' 
http server as well as connect middleware. This is the recommended means of creating runtimes, 
However, if you need to access the runtime directly or are simply curious, you can also setup 
the runtime in the following way...

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

Setting up on a nodejs http server.

```javascript
//----------------------------------------------
// file: program.ts
//----------------------------------------------
export module services {
	
	// url: http://localhost:3000/services/message
	export function message (context) { 
		
		context.response.write('hello typescript');

		context.response.end(); 
	}
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

export module services {
	
	// url: http://localhost:3000/services/message
	export function message (context) { 
		
		context.response.write('hello typescript');

		context.response.end(); 
	}
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

Appex enables developers to write http endpoints by writing typescript functions. 

The following section describes how to write http accessible functions. 

<a name="appex_context" />
### appex_context

All appex functions are passed a object context as the first argument. The context object encapulates
the http request and response objects issued by the underlying http server, as well as
additional objects specific to appex. These are listed below:

```javascript
// the context object
export function method(context) {
	// context.request    - the http request object.
	// context.response   - the http response object.
	// context.reflection - appex runtime type information.
	// context.routes     - appex routing tables.
	// context.exports    - appex module exports. 
}
```

<a name="appex_http_handlers" />
### appex http handlers

A appex http handler is defined with the following signature.

* argument[0] - the appex context
* returns     - void (optional)

http handler functions need to complete the http request.

```javascript
export function method(context) : void {

	context.response.write('hello world');
	
	context.response.end();
}
```

<a name="appex_json_handlers" />
### appex json handlers

A appex json handler is a function suited to handling json based http requests. appex json handlers
are invoked via HTTP POST and expect JSON to be subbmited with the request. Passing null or invalid
JSON results in the request argument being null.

A appex json handler requires the following signature.

* argument[0] - the appex context
* argument[1] - A optionally typed json request object. 
* argument[2] - a optionally typed optypescript callback with a single argument for the object response.
* returns     - void (optional) 

The return type is optional. json handler functions "must" invoke the callback to complete the request.

```javascript
export function method(context, request, callback:(response) => void) : void {

	callback(request); // echo the object back.

}
```
<a name="appex_signatures" />
### appex signatures

Appex only supports two function signatures for http binding. Functions that do not conform to these
signatures will be ignored as http endpoints.

<a name="exporting_functions" />
### exporting_functions

Appex extends TypeScripts concept of visibility to include visibility over http. From this
developers and control which functions are exported as http handlers.  

In order to make a function accessible over http, you must explicitly "export" this function. 

Consider the following example:

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

The above will result in the following route being created:

```javascript
http://[host]:[port]/public_function
```

<a name="routing_functions" />
### routing functions

Appex creates routes based on module scope and function name. consider the following:

```javascript
export function index   (context:any) { }

export function about   (context:any) { }

export function contact (context:any) { }

export module services.customers {

	export function insert(context:any) : void { }

	export function update(context:any) : void { }

	export function delete(context:any) : void { }
}

// results in the following routes
// http://[host]:[port]/
// http://[host]:[port]/about
// http://[host]:[port]/contact
// http://[host]:[port]/services/customers/insert
// http://[host]:[port]/services/customers/update
// http://[host]:[port]/services/customers/delete
```

<a name="index_functions" />
### index_functions

Appex denotes that functions named 'index' resolve to the current module scope. As demonstrated below: 

```javascript
export function index(context) { }

export module blogs {

	export function index (context) { }

	export function get   (context) { }
}

// results in the following routes
// http://[host]:[port]/
// http://[host]:[port]/blogs
// http://[host]:[port]/blogs/get
```

<a name="developing_with_appex" />
## developing with appex

Appex enables nodejs developers to write applications in TypeScript as though it were native to nodejs. The following
section outlines how to effeciently with Appex and the TypeScript programming language.

<a name="development_mode" />
### development_mode

```javascript 
// enable dynamic compilations with the devmode option.
var runtime = appex.runtime ({ sourcefile : './program.ts', devmode : true, logging: true }); 
```
Appex is built directly on top of the Microsoft TypeScript 0.9 compiler and leverages it for tight
integration with the nodejs platform. By enabling the 'devmode' option, Appex will efficiently
rebuild your source code on each request made to the server. 

Appex achieves performance in this regard by leveraging features available in
TypeScript compiler which facilitate incremental building / caching of typescript 
compilation units. 

In addition to this, compilations are run as a background worker process to ensure they 
do interupt requests being served on the parent web process. 

Appex will output syntax and type errors to the stdout and http response. Syntax errors 
will not bring down the web process. And you won't need to restart on code updates.


<a name="structuring_projects" />
### structuring projects

Appex leverages TypeScript's ability to reference source files with the 'reference' element. Appex 
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

export function index   (context) { /* handle request */ }
export function about   (context) { /* handle request */ }
export function contact (context) { /* handle request */ }

//---------------------------------------------------	
// file: users.ts
//---------------------------------------------------

export module users {

	export function login  (context) { /* handle request */ }
	export function logout (context) { /* handle request */ }
}

```

<a name="resources" />
## additional resources

* [typescript homepage](http://www.typescriptlang.org/)
* [typescript language specification](http://www.typescriptlang.org/Content/TypeScript%20Language%20Specification.pdf)
* [typescript declarations repository](https://github.com/borisyankov/DefinitelyTyped)
