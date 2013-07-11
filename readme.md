![](https://raw.github.com/sinclairzx81/appex/master/studio/static/diagrams/logo.jpg)

### nodejs web api with [typescript](http://www.typescriptlang.org/)

```javascript
//----------------------------------------------
// app.js
//----------------------------------------------

var appex = require('appex');

var app = appex({ program : './program.ts' });

app.listen(3000);

//----------------------------------------------
// program.ts
//----------------------------------------------

// http://localhost:3000/
export function index(app) {

	app.response.write('home');

	app.response.end();
}

// http://localhost:3000/about
export function about(app) {

	app.response.write('about');

	app.response.end();
}

```
### install

```javascript
npm install appex
```
## overview

appex is a nodejs web api framework built on top of the TypeScript programming language. It enables
developers to develop RESTful service endpoints by writing TypeScript functions, as well as providing
reflection / type and interface meta data derived from the languages type system.

* [getting started](#getting_started)
	* [application](#application)
	* [options](#options)
	* [http server](#http_server)
	* [express middleware](#express_middleware)
* [creating services with typescript](#creating_services)
	* [app context](#app_context)
	* [routing handlers](#routing_handlers)
	* [handler signatures](#handler_signatures)
	* [named handlers](#named_handlers)
	* [index handlers](#index_handlers)
	* [wildcard handlers](#wildcard_handlers)
	* [attributes](#attributes)
	* [exporting functions](#exporting_functions)
	* [handling 404](#handling_404)
* [developing with appex](#developing_with_appex)
	* [structuring projects](#structuring_projects)
* [additional resources](#resources)

<a name="getting_started" />
## getting started

The following sections outline configuring appex.

<a name="application" />
### application

Setting up. 

```javascript
var appex   = require('appex');

var app   = appex({ program : './program.ts', 
                    devmode : true,
                    logging : true });

app.listen(3000);
```

<a name="options" />
### options

appex accepts the following startup options.

```javascript
var options = { 
	// (required) location of source file.
	program    : './program.ts', 

	// (optional) recompile on request. (default:false) 
	devmode    : true,          

	// (optional) log to stdout. (default:false) 
	logging    : true,

	// (optional) user defined objects added to the app context.
	context    : {}
};

var app = appex( options );
```

<a name="http_server" />
### http server

Setting up appex on a nodejs http server.

```javascript
var http = require('http');

var appex = require('appex');

var app = appex({ program : './program.ts' });

var server = http.createServer( app );

server.listen(3000);
```
<a name="express_middleware" />
### express middleware

Setting up as express middleware.

```javascript
var express = require('express');

var appex = require('appex');

var app = express();

app.use(appex({ program : './program.ts' })); 

app.get('/', function(req, res) {

  res.send('Hello World');
  
});

app.listen(3000);
```

<a name="creating_services" />
## creating services with typescript

The following section describes how to write http accessible functions with appex.

<a name="app_context" />
### app context

All appex functions are passed a application context object as their first argument. The app context object 
encapulates the http request and response objects issued by the underlying http server, as well as
additional objects specific to appex. These are listed below:

```javascript
// the app context
export function method(app) {
	
	// app.request    - the http request object.

	// app.response   - the http response object.

	// app.attribute  - appex attributes.

	// app.module     - appex module reflection and meta data.

	// app.routes     - appex routing tables.

	// app.mime       - appex mime utility.

	// app.[custom]   - user defined. (see options.context)
}
```

<a name="routing_handlers" />
### routing handlers

appex creates routes based on module scope and function name. consider the following:

```javascript
export module services.customers {
	
	// url: http://[host]:[port]/services/customers/insert
	export function insert(app) { /* handle route */ }
	
	// url: http://[host]:[port]/services/customers/update
	export function update(app) { /* handle route */ }
	
	// url: http://[host]:[port]/services/customers/delete
	export function delete(app) { /* handle route */ }
}

// url: http://[host]:[port]/
export function index   (app) { /* handle route */ }

// url: http://[host]:[port]/about
export function about   (app) { /* handle route */ }

// url: http://[host]:[port]/contact
export function contact (app) { /* handle route */ }

// url: http://[host]:[port]/(.*)
export function wildcard (app, path) { /* handle route */ }

```

<a name="handler_signatures" />
### handler signatures

appex supports three function signatures for http routing (named, index and wildcard). Functions that
do not apply these signatures will not be routed.

<a name="http_handlers" />
### named handlers

Named handlers resolve urls to their current module scope + the name of the function.

Named handlers require the following signature:

* name        - 'anything'
* argument[0] - app context
* returns     - void (optional)

```javascript

// http://[host]:[port]/about
export function about(app) {

	app.response.write('about page');
	
	app.response.end();
}

// http://[host]:[port]/users/login
export module users {

	export function login(app) {
		
		app.response.write('handle login');
	
		app.response.end();		
	}
}

```

<a name="index_handlers" />
### index handlers

Index handlers resolve urls to their current module scope.

Index handlers require the following signature:

* name        - 'index'
* argument[0] - app context
* returns     - void (optional)

```javascript
// url: http://[host]:[port]/
export function index(app) { 

	app.response.write('home page');
	
	app.response.end();
}

export module blogs {
	
	// url: http://[host]:[port]/blogs
	export function index  (app) 
	{	
		app.response.write('blog index');
	
		app.response.end();
	}
}
```

<a name="wildcard_handlers" />
### wildcard handlers

Wildcard handlers resolve their urls to their current module scope + url.

appex wildcard handlers allow for wildcard routing at a given module scope. Wildcard handlers
support 'typed' url argument mapping, as denoted by the arguments annotation.

In addition, wildcard handlers also support optional arguments. As specific with TypeScript's '?' on argument names.

appex wildcard handlers require the following signature:

* name        - 'wildcard'
* argument[0] - app context
* argument[n] - 1 or more arguments to be mapped from the url
* returns     - void (optional)

```javascript
declare var console;

export module blogs {
	
	// url : http://[host]:[port]/blogs/2013/1/11   - matched

	// url : http://[host]:[port]/blogs/2013/01/11  - matched

	// url : http://[host]:[port]/blogs/2013/01/3rd - not matched - (see number annotation)

	// url : http://[host]:[port]/blogs/2013/01     - matched     - (see ? annotation)

	// url : http://[host]:[port]/blogs/2013        - not matched - (month is required)
	
    export function wildcard(app, year:number, month:number, day?:number) {
		
		console.log(year); 

		console.log(month);

		console.log(day);

        app.response.write('my blog')

        app.response.end(); 
    }
}

// url : http://[host]:[port]/
export function index(app) {

	app.response.write('home page');
	
	app.response.end();
}

// url : http://[host]:[port]/(.*) 
export function wildcard(app, path) {

	app.response.writeHead(404, {'content-type' : 'text/plain'});
	
	app.response.write(path + ' not found');
	
	app.response.end();
}

```
note: appex supports boolean, number, string and any annotations on wildcard arguments. if no annotation
is specified, appex interprets the argument as a string. the type 'any' is also interpreted as string.

note: wildcard functions should be declared last in any module scope. this ensures other routes
will be matched first.

<a name="attributes" />
### attributes

appex supports a cascading attributute scheme on modules and functions. Attributes are declaritive meta data
you can associate with appex handlers to describe characteristics on given routes. Attributes are analogous to .net attributes,
however, they also have a cascading behaviour that can be used to apply metadata for an entire scope. A concept similar to 
cascading stylesheets rules.

By default, appex uses attributes for HTTP VERB matching:

```javascript

declare var attribute;

attribute("contact", {  verbs: ["get"]  } );

export function contact(app) {

	// handler will only be invoke on HTTP GET requests
}

attribute("submit", {  verbs: ["post"]  } );

export function submit(app) {

	// handler will only be invoke on HTTP POST requests
}

```

the following demonstrates attribute cascading behavior.

```javascript
declare var attribute;

attribute('foo', {a : 10})
export module foo {

    attribute('foo.bar', {b : 20})
    export module bar {
            
        attribute('foo.bar.index', {c : 30})
        export function index(app) {
        
            //app.attribute
            //{
            //    "a": 10,
            //    "b": 20,
            //    "c": 30
            //}            

            app.response.writeHead(200, {'content-type' : 'text/plain'});
	
            app.response.write( JSON.stringify(app.attribute, null, 4) );
	
            app.response.end();       
        }
    }
}

```

and for something more practical..

```javascript
declare var attribute;

attribute('admin', { roles : ['administrators'] )
export module admin {
	
	export function index(app) {
		
		var user = app.user;

		if(!user.isInRole( app.attribute.roles ) ) {

			// access denied!

		}
	}
}

```

attributes can also be looked up by calling attribute( qualifier ).

```javascript

declare var attribute;

attribute("other", {  verbs: ["get"], message:'hello' } );
export function other(app) {
    
	app.response.write(app.attribute.message);
	
	app.response.end();
}

export function index(app) {
    
	var info = attribute('other'); // look up.
	
	app.response.write( JSON.stringify(info, null, 4) );
	
	app.response.end();	
}

```

<a name="exporting_functions" />
### exporting functions

appex will only route functions prefix with the TypeScript 'export' declarer. This rule
also applied to modules. Developers can use this to infer notions of public and private 
at the http level.

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
export function public_function   (app) { 
	
	// this function can invoke private functions.
	private_function(); // ok
	
	// calling exported method in private module
	private_module.public_method(); // ok

	// calling non exported method in private module
	// private_module.private_method(); // bad

	app.response.write('testing');

	app.response.end();
}
```

<a name='handling_404' />
### handling 404

Use wildcard functions to catch unhandled routes.

```javascript
// http:[host]:[port]/
export function index   (app) { 

	app.response.writeHead(404, {'content-type' : 'text/plain'});

	app.response.write('home page');

	app.response.end();
}

// http:[host]:[port]/(.*)
export function wildcard(app, path) {

	app.response.writeHead(404, {'content-type' : 'text/plain'});

	app.response.write(path + ' page not found');
	
	app.response.end();
}
```

<a name="developing_with_appex" />
## developing with appex

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

var app = appex ({ program : './index.ts' });

app.listen(3000);

//---------------------------------------------------	
// file: index.ts
//---------------------------------------------------

/// <reference path="pages.ts" />
/// <reference path="users.ts" />

//---------------------------------------------------	
// file: pages.ts
//---------------------------------------------------

// http://[host]:[port]/
export function index   (app) { /* handle request */ }

// http://[host]:[port]/about
export function about   (app) { /* handle request */ }

// http://[host]:[port]/contact
export function contact (app) { /* handle request */ }

//---------------------------------------------------	
// file: users.ts
//---------------------------------------------------

export module users {
	
	// http://[host]:[port]/users/login
	export function login  (app) { /* handle request */ }
	
	// http://[host]:[port]/users/logout
	export function logout (app) { /* handle request */ }
}

```

<a name="resources" />
## additional resources

* [typescript homepage](http://www.typescriptlang.org/)
* [typescript language specification](http://www.typescriptlang.org/Content/TypeScript%20Language%20Specification.pdf)
* [typescript declarations repository](https://github.com/borisyankov/DefinitelyTyped)
