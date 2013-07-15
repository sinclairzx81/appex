![](https://raw.github.com/sinclairzx81/appex/master/artifacts/logo.jpg)

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
export function index(context) {

	context.response.send('home');
}

// http://localhost:3000/about
export function about(context) {

	context.response.send('about');
}

// http://localhost:3000/(.*)
export function wildcard (context, path) {
    
    context.response.send(404, path + "not found");
}

```
### install

```javascript
npm install appex
```
## overview

appex is a nodejs web api framework built on top of the TypeScript programming language. It enables
developers to create RESTful service endpoints by writing TypeScript functions, as well as providing
reflection / type meta data derived from the languages type system.

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
	* [cascades](#cascades)
	* [http verbs](#http_verbs)
	* [middleware](#middleware)
	* [exporting functions](#exporting_functions)
	* [handling 404](#handling_404)
	* [serving static files](#serving_static_files)
* [reflection](#reflection)
	* [reflect everything](#reflect_everything)
	* [reflect specific types](#reflect_specific_types)
	* [json schema](#json_schema)
* [developing with appex](#developing_with_appex)
	* [appex.d.ts declaration](#appex_declaration)
	* [structuring projects](#structuring_projects)
* [additional resources](#resources)
* [license](#license)

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

appex can run as express middleware. By running appex in this context, it will attempt to match incoming routes. if
not matched, appex will pass the request on for express handle.

```javascript
var express = require('express');

var appex = require('appex');

var app = express();

app.use( appex({ program : './program.ts' }) ); 

app.get('/', function(req, res) {

  res.send('Hello World');
  
});

app.listen(3000);
```
in addition, appex will inheritate the characteristics of existing middleware. consider the following example
which defines the express.bodyParser(), which is passed onto the context.request object.

```javascript

//----------------------------------------------
// app.js
//----------------------------------------------

var app = express();

app.configure(function(){

  app.set('port', process.env.PORT || 3232);

  app.set('views', __dirname + '/views');

  app.set('view engine', 'jade');

  app.use(express.bodyParser());

  app.use( appex({program:'./program.ts', devmode:true} ));  // inheriates bodyParser().  

  app.use(app.router);

  app.use(express.static(path.join(__dirname, 'public')));
});

//----------------------------------------------
// program.ts
//----------------------------------------------

export function index(context) {
	
	//context.request.body <-- available on the context.
	
	context.response.send('home'); // the express send method.
}
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
export function method(context) {
	
	// context.request    - the http request object.

	// context.response   - the http response object.

	// context.cascade    - appex cascade.

	// context.next       - the next function (express middleware)
	
	// context.router     - the appex router
	
	// context.module     - the module being run (this module)

	// context.schema     - json schema api.

	// context.mime       - a http mime type utility.
}
```

it is possible to extend the default objects passed on the context by adding them on the appex startup options. The 
following will attach the async module to the context. 

```javascript
//----------------------------------------------
// app.js
//----------------------------------------------

var appex   = require('appex');

var app = appex({ program : './program.ts', 
				  devmode : true, 
			      context: {
						async : require('async')
				  }});

app.listen(3000);

//----------------------------------------------
// program.ts
//----------------------------------------------

export function index(context) {

	// context.async = passed on the context.

	context.response.send('home page');
}
```
<a name="routing_handlers" />
### routing handlers

appex creates routes based on module scope and function name. consider the following:

```javascript
export module services.customers {
	
	// url: http://[host]:[port]/services/customers/insert
	export function insert(context) { /* handle route */ }
	
	// url: http://[host]:[port]/services/customers/update
	export function update(context) { /* handle route */ }
	
	// url: http://[host]:[port]/services/customers/delete
	export function delete(context) { /* handle route */ }
}

// url: http://[host]:[port]/
export function index   (context) { /* handle route */ }

// url: http://[host]:[port]/about
export function about   (context) { /* handle route */ }

// url: http://[host]:[port]/contact
export function contact (context) { /* handle route */ }

// url: http://[host]:[port]/(.*)
export function wildcard (context, path) { /* handle route */ }

```

<a name="handler_signatures" />
### handler signatures

appex supports three function signatures for http routing (named, index and wildcard). Functions that
do not apply these signatures will not be routed.

<a name="named_handlers" />
### named handlers

Named handlers resolve urls to their current module scope + the name of the function.

Named handlers require the following signature:

* name        - 'anything'
* argument[0] - app context
* returns     - void (optional)

```javascript

// http://[host]:[port]/about
export function about(context) {

	context.response.send('about page');
}

// http://[host]:[port]/users/login
export module users {

	export function login(context) {
		
		context.response.send('handle login');	
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
export function index(context) { 

	context.response.send('home page');
}

export module blogs {
	
	// url: http://[host]:[port]/blogs
	export function index  (context) 
	{	
		context.response.send('blog index');
	}
}
```

<a name="wildcard_handlers" />
### wildcard handlers

Wildcard handlers resolve their urls to their current module scope + url.

appex wildcard handlers allow for wildcard routing at a given module scope. Wildcard handlers
support 'typed' url argument mapping, as denoted by the arguments annotation.

In addition, wildcard handlers also support optional arguments which can be specified with TypeScript's '?' 
on argument names.

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
	
    export function wildcard(context, year:number, month:number, day?:number) {

        context.response.json({ year: year, month: month, day: day})
    }
}

// url : http://[host]:[port]/
export function index(context) {

	context.response.send('home');
}

// url : http://[host]:[port]/(.*) 
export function wildcard(context, path) {

	context.response.send(404, 'not found');
}

```
note: appex supports boolean, number, string and any annotations on wildcard arguments. if no annotation
is specified, appex interprets the argument as a string. the type 'any' is also interpreted as string.

note: wildcard functions should be declared last in any module scope. this ensures other routes
will be matched first.

<a name="cascades" />
### cascades

appex supports a cascading attribute scheme on modules and functions. With this, developers can apply
arbituary meta data for modules and functions that will propagate through scope. appex has two special
cascade properties for middleware and http verb matching, which are described below, however consider
the following code which illustrates the concept.

```javascript
declare function cascade (qualifier:string, obj:any);

cascade({a: 10}); // global.

cascade('foo', {b : 20})
export module foo {

    cascade('foo.bar', {c : 30})
    export module bar {
            
        cascade('foo.bar.index', {d : 40})
        export function index(context) {
        
            //context.cascade
            //{
            //    "a": 10,
            //    "b": 20,
            //    "c": 30,
			//    "d": 40
            //}

            context.response.json( context.cascade );       
        }
    }
}

```

<a name="http_verbs" />
### http verbs

appex handles http verb matching with cascades. appex will recognise the 
'verbs' property applied to the cascade to match against http verbs.

```javascript
cascade('index', { verbs: ['get'] })
export function index (context) { 
        
    // only allow HTTP GET requests
    context.response.send('index')
}

cascade('index', { verbs: ['post', 'put'] })
export function submit (context) { 
    
    // only allow HTTP POST and PUT requests
    context.response.send('submit')
}
```


<a name="middleware" />
### middleware

appex supports middleware with cascades. appex middleware defined with cascades allows
developers to scope middleware on single functions, or entire module scopes. appex will 
recognise the 'use' property applied to the cascade to invoke middleware.

the following demonstrates how one might use middleware to secure a site admin.

note: middleware 'must' call next or handle the request. 

```javascript
declare function cascade (qualifier:string, obj:any);

declare var console;

function authenticate(context) {

    console.log('authenticate')

	// call next() if authenticated, otherwise, handle the response.
    context.next(); 
}

function authorize(context) {

    console.log('authorize')

	// call next() if authorized, otherwise, handle the response.
    context.next(); 
}

// apply security middleware to admin scope.
cascade('admin', {use: [authenticate, authorize]}) 
export module admin {

    export function index(context) {
        
        console.log(context.cascade); // view cascade

        context.response.send('access granted!')
    }
}

// index handler has no middleware applied.
export function index (context) { 
    
    console.log(context.cascade); // view cascade

    context.response.send('home')
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
export function public_function   (context) { 
	
	// this function can invoke private functions.
	private_function(); // ok
	
	// calling exported method in private module
	private_module.public_method(); // ok

	// calling non exported method in private module
	// private_module.private_method(); // bad

	context.response.send('public_function');
}
```

<a name='handling_404' />
### handling 404

Use wildcard functions to catch unhandled routes.

```javascript
// http:[host]:[port]/
export function index (context) { 

	context.response.send('home page');
}

// http:[host]:[port]/(.*)
export function wildcard (context, path) {

	context.response.send(404, path + ' not found');
}
```
<a name="serving_static_files" />
## serving static files

Use wildcard functions with context.response.serve() to serve static content.

```javascript
export module static {
	
	// http:[host]:[port]/static/(.*)
	export function wildcard(context, path) {

		context.response.serve('./static/', path);
	}
}

// http:[host]:[port]/
export function index (context) {

	context.response.send('home page');
}

// http:[host]:[port]/(.*)
export function wildcard(context, path) {

	context.response.send(404, path + ' not found');
}
```

<a name="reflection" />
## reflection

appex provides a reflection api derived from TypeScript's type system that developers can 
leverage to reflect type information declared throughout their appex modules. 

the following section outlines how to use the reflection api.

<a name="reflect_everything" />
### reflect everything

the appex reflection api is passed on the context.module.reflection property and is available to all
appex handler methods. The following code will JSON serialize everything declared in your appex
project and write it to the http response. 

```javascript
export function index (context:appex.web.Context) {
    
    context.response.json( context.module.reflection );
}
```
<a name="reflect_specific_types" />
### reflect specific types

In typical scenarios, developers will want to leverage reflection meta data to generate
service contacts and client side models. the reflection api lets you access meta data 
for the following types declared in your project. 

* modules
* imports
* classes
* interfaces
* functions
* variables

to access specific type metadata, use the reflection.get([qualifier]) method, as demonstrated below.

```javascript
export module models {
    
    export class Customer {

        public firstname   : string;

        public lastname    : string;

        public age         : number;
    }
}

export function index (context:appex.web.Context) {
    
    context.response.json( context.module.reflection.get('models.Customer') );
}
```
and methods..

```javascript
function some_method(a:string, b:number, c?:boolean) : void { }

export function index (context:appex.web.Context) {
    
    context.response.json( context.module.reflection.get('some_method') );
}
```

....and variables...

```javascript
var some_variable:number = 10;

export function index (context:appex.web.Context) {
    
    context.response.json( context.module.reflection.get('some_variable') );
}
```
<a name="json_schema" />
### json schema

appex supports reflecting back JSON schema meta data from class and interface type definitions. for example, the following
will output a json schema on the type 'models.Employee'.

```javascript

export module models {

	export class Address {

        /** street */
		public addressLine1: string;
        /** suburb */		
        public addressLine2: string;
	}
	
	export class User {

		/** this users id */
        public id : string;
	}

    export class Customer extends User {
        
        /** the customers firstname */
		public firstname  : string;
		
        /** the customers lastname */
        public lastname   : string;
    }

	export class Employee extends User {

        /** the employees firstname */
		public firstname  : string;
		
        /** the employees lastname */
        public lastname   : string;
		
        /** the employees address */
        public address  : Address;

        /** this employees customers */
        public customers : Customer[];
	}
}

export function index (context) {
    
    context.response.json( context.schema.get('models.Employee') );
}

```

which generates the following json schema.

```javascript
{
    "id": "#models.Employee",
    "type": "object",
    "properties": {
        "id": {
            "id": "id",
            "type": "string",
            "description": "this users id"
        },
        "firstname": {
            "id": "firstname",
            "type": "string",
            "description": "the employees firstname"
        },
        "lastname": {
            "id": "lastname",
            "type": "string",
            "description": "the employees lastname"
        },
        "address": {
            "id": "#models.Address",
            "type": "object",
            "properties": {
                "addressLine1": {
                    "id": "addressLine1",
                    "type": "string",
                    "description": "street"
                },
                "addressLine2": {
                    "id": "addressLine2",
                    "type": "string",
                    "description": "suburb"
                }
            },
            "required": [
                "addressLine1",
                "addressLine2"
            ]
        },
        "customers": {
            "id": "customers",
            "type": "array",
            "items": {
                "type": {
                    "id": "#models.Customer",
                    "type": "object",
                    "properties": {
                        "id": {
                            "id": "id",
                            "type": "string",
                            "description": "this users id"
                        },
                        "firstname": {
                            "id": "firstname",
                            "type": "string",
                            "description": "the customers firstname"
                        },
                        "lastname": {
                            "id": "lastname",
                            "type": "string",
                            "description": "the customers lastname"
                        }
                    },
                    "required": [
                        "id",
                        "firstname",
                        "lastname"
                    ]
                }
            },
            "description": "this employees customers"
        }
    },
    "required": [
        "id",
        "firstname",
        "lastname",
        "address",
        "customers"
    ]
}
```

<a name="developing_with_appex" />
## developing with appex

This section outlines development with appex.

<a name="appex_declaration" />
### appex.d.ts declaration

If you develop on a TypeScript complicant editor (one that supports TS 0.9), appex comes bundled
with a declaration file you can reference in your project. If installing appex via npm, your
reference should be as follows.

```javascript
/// <reference path="node_modules/appex/appex.d.ts" />

export function index (context:appex.web.IContext) { 
    
    context.response.send('hello');
}

export function wildcard(context:appex.web.IContext, path:string) {

    context.response.serve('./', path);
}
```

By referencing this in your project, you get the benefits of code completion and static type checking
against both appex, and the nodejs core.

![](https://raw.github.com/sinclairzx81/appex/master/artifacts/code-completion.jpg)

Additional declaration files may be obtained from [here](https://github.com/borisyankov/DefinitelyTyped)

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

/// <reference path="users.ts" />
/// <reference path="pages.ts" />

//---------------------------------------------------	
// file: users.ts
//---------------------------------------------------

export module users {
	
	// http://[host]:[port]/users/login
	export function login  (context) { context.response.send('users.login') }
	
	// http://[host]:[port]/users/logout
	export function logout (context) { context.response.send('users.logout') }
}

//---------------------------------------------------	
// file: pages.ts
//---------------------------------------------------

// http://[host]:[port]/
export function index   (context) { context.response.send('home') }

// http://[host]:[port]/about
export function about   (context) { context.response.send('about') }

// http://[host]:[port]/contact
export function contact (context) { context.response.send('contact') }

export function wildcard (context, path) { context.response.send(404, ' not found') }

```

<a name="resources" />
## additional resources

* [typescript homepage](http://www.typescriptlang.org/)
* [typescript language specification](http://www.typescriptlang.org/Content/TypeScript%20Language%20Specification.pdf)
* [typescript declarations repository](https://github.com/borisyankov/DefinitelyTyped)

<a name="license" />
## license

The MIT License (MIT)

Copyright (c) 2013 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
