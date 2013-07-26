![](https://raw.github.com/sinclairzx81/appex/master/artifacts/logo.jpg)

### nodejs web api with [typescript](http://www.typescriptlang.org/)

## overview

appex is a nodejs web application framework built around the TypeScript programming language and
compiler. appex lets developers create and route http endpoints with TypeScript modules and 
functions, as well as providing nodejs developers similar reflection and type introspection 
services found in platforms such as .net.

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
    
    context.response.send(404, path + " not found");
}

```
### install

```javascript
npm install appex
```
### contents

* [getting started](#getting_started)
	* [create a application](#application)
	* [start up options](#options)
	* [running on an existing http server](#http_server)
	* [running as express middleware](#express_middleware)
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
* [templating](#templating)
	* [rendering templates](#rendering_templates)
	* [template context](#template_context)
	* [layouts](#template_layouts)
	* [partials](#template_partials)
	* [caching and devmode](#caching_and_devmode)
* [json schema](#json_schema)
	* [generating schema](#generating_schema)
	* [validating json](#validating_json)
* [reflection](#reflection)
	* [reflect everything](#reflect_everything)
	* [reflect specific types](#reflect_specific_types)
* [developing with appex](#developing_with_appex)
	* [appex.d.ts declaration](#appex_declaration)
	* [structuring projects](#structuring_projects)
* [additional resources](#resources)
* [license](#license)

<a name="getting_started" />
## getting started

The following sections outline creating appex applications and configuration.

<a name="application" />
### create a application

The following code will create a standalone appex application and 
http server and listen on port 3000.

```javascript
var appex   = require('appex');

var app   = appex({ program : './program.ts', 
                    devmode : true,
                    logging : true });

app.listen(3000);
```

note: devmode and logging are optional. however, when developing 
with appex, it is helpful to have these enabled.

<a name="options" />
### start up options

appex accepts the following start up options.

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
### running on an existing http server

The following demonstrates setting up appex on an existing nodejs http server. In 
this example, appex will attempt to handle incoming requests, and if appex cannot
route the request, will fire the callback.

```javascript
var http  = require('http');

var appex = require('appex');

var app = appex({ program : './program.ts' });

var server = http.createServer(function(req, res){

    app(req, res, function() { // appex handler...
		
		// not handled.

	}); 
});

server.listen(3000);
```


<a name="express_middleware" />
### running as express middleware

appex allows developers to augment existing express / connect applications by 
way of middleware. The following demonstrates setting up appex as express middleware.

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

Like in the "running on an existing http server" example above, appex will attempt to intercept incoming requests. 
if appex cannot find a matching route for the request, it will automatically call the "next" function to pass the request 
on to the next middleware or express handler.

in addition to this, appex may also act as traditional express middleware. In the example below, a appex wildcard
function is created which will match "all" incoming requests, the wildcard function simply prints hello world to 
the console and then calls context.next(), which passes the request on the express handler.

```javascript

//----------------------------------------------
// program.ts
//----------------------------------------------

// http:[host]:[port]/(.*)
export function wildcard(context, path) {

	console.log('hello world!!');

	context.next(); // pass it on!
}

//----------------------------------------------
// app.js
//----------------------------------------------

var express = require('express');

var appex = require('appex');

var app = express();

app.use( appex({ program : './program.ts' }) );

app.get('/', function(req, res) {

  res.send('Hello World');
  
});

app.listen(3000);
```

Just like traditional express middleware, appex will also inheriate the characteristics of the request.

consider the following example in which the jade view engine is configured for use. appex will inheritate the 
response.render() method, which is passed to the appex handler as context.response.render()

```javascript
//----------------------------------------------
// app.js
//----------------------------------------------

app.configure(function(){

  app.set('views', __dirname + '/views');
  
  // set up the jade engine.
  app.set('view engine', 'jade'); 
  
  // bind appex
  app.use( appex({program:'./program.ts', devmode:true} ));  
});

//----------------------------------------------
// program.ts
//----------------------------------------------

// http:[host]:[port]/
export function index(context) {
	
	// jade renderer works!
	context.response.render('index', { title: 'Express' }); 
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

	// context.template   - the appex template engine.
	
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

appex will only route functions prefixed with the TypeScript 'export' declarer. This rule
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

<a name="templating" />
## templating

appex comes bundled with a built in template engine which is modelled on the Microsoft 
Razor templating engine. The following sections outline its use.

<a name="rendering_templates" />
### rendering templates

the template engine is passed on the appex app context. The following demonstrates
passing data to, and rendering a template with the engine.
```javascript
//----------------------------------------------
// view.txt
//----------------------------------------------

@for(var n in context.users) {

	@if(context.users[n].online) {
			
		@(context.users[n].name)
	}
}

//----------------------------------------------
// program.ts
//----------------------------------------------

export function index(context) {
	
    var users = [{name:'dave' , online : true}, 
                 {name:'smith', online : true}, 
                 {name:'jones', online : false}, 
                 {name:'alice', online : true}];

    var text = context.template.render('./view.txt', { users: users });

    context.response.send(text);
}

```
note: appex templates supports two control statements, @if for conditions and @for for iteration.

note: rendering variables are achieved with the @(expression) syntax. i.e. @("hello world") or 
@(my_var_here).


<a name="template_context" />
### template context

All user data passed to a template for rendering is passed on the templates 'context'.

<a name="layouts" />
### layouts

appex templates support layouts by way of the @layout and @section statements.

consider the following where layout.txt defines the sections 'header' and 'content' and the view.txt overrides
these sections with its own content.

```javascript
//----------------------------------------------
// layout.txt
//----------------------------------------------

<html>

	<head>
		
		@section header

	</head>

	<body>

		@section content {
		
			<span>some default content</span>
			
		}

	</body>
	
</html>

//----------------------------------------------
// view.txt
//----------------------------------------------

@layout 'layout.txt'

@section header {

	<title>my page</title>
}

@section content {

	<p>overriding the layout.txt content section.</p>

	<ul>
	@for(var n in context.users) {

		@if(context.users[n].online) {
			
			<li>@(context.users[n].name)</li>
		}
	}
	</ul>
}

//----------------------------------------------
// program.ts
//----------------------------------------------

export function index(context) {
	
    var users = [{name:'dave' , online : true}, 
                 {name:'smith', online : true}, 
                 {name:'jones', online : false}, 
                 {name:'alice', online : true}];

    var text = context.template.render('./view.txt', { users: users });

    context.response.send(text);
}
```

note : it is optional to override content in the view.txt. 

note : @sections without a body (like the header above) are treated as placeholders. 

<a name="partials" />
### partials

appex templates also allow for partial views with the @render statment. consider the following 
which renders the nav.txt file into the layout.txt file.

```javascript
//----------------------------------------------
// nav.txt
//----------------------------------------------
<ul>
	<li>home</li>
	<li>about</li>
	<li>contact</li>
</ul>

//----------------------------------------------
// layout.txt
//----------------------------------------------

<html>
	<head>
		
		@section header

	</head>

	<body>
		
		@render 'nav.txt'

		@section content {
		
			<span>some default content</span>
			
		}

	</body>
	
</html>

//----------------------------------------------
// view.txt
//----------------------------------------------

@layout 'layout.txt'

@section header {

	<title>my page</title>
}

@section content {

	<p>overriding the layout.txt content section.</p>

	<ul>
	@for(var n in context.users) {

		@if(context.users[n].online) {
			
			<li>@(context.users[n].name)</li>
		}
	}
	</ul>
}

//----------------------------------------------
// program.ts
//----------------------------------------------

export function index(context) {
	
    var users = [{name:'dave' , online : true}, 
                 {name:'smith', online : true}, 
                 {name:'jones', online : false}, 
                 {name:'alice', online : true}];

    var text = context.template.render('./view.txt', { users: users });

    context.response.send(text);
}
```

<a name="caching_and_devmode" />
### caching and devmode

appex template content is not cached (the implementor is expected to handle their own caching)
however the generated template code is. 

appex templates do inheriate the behaviour of the appex 'devmode' option. setting
devmode to 'true' will cause template code to be reloaded from disk and code generated with each 
request. setting devmode to false will load content from disk on first request, and 
cache the generated template code in memory for the lifetime of the application.

<a name="json_schema" />
## json schema

appex provides functionality for generating json schemas from TypeScript classes
and interfaces as well as tools for validating json data.

<a name="generating_schema" />
### generating schema

The following demonstrates generating json schema from the following class
hierarchy.

```javascript
export module model {

    /** a product */
    export class Product {
        
        /** the product name */
        public name        : string;

        /** the product description */
        public description : string;

        /** the product cost */
        public cost        : number;
    } 

    /** a order */
    export class Order {
        
        /** the product being ordered */
        public products  : Product;
    }

    /** a customer */
    export class Customer {

        /** the customers firstname */
        public firstname  : string;

        /** the customers lastname */
        public lastname   : string;

        /** orders made by this customer */
        public orders     : Order[];
    }
}

export function index (context:appex.web.IContext) {
	
	// pass the fully qualified name of the type.
    var schema = context.schema.generate('model.Customer');

    context.response.json(schema);
}
```

which generates the following json schema.

```javascript
{
    "id": "model.Customer",
    "type": "object",
    "description": "a customer",
    "properties": {
        "firstname": {
            "type": "string",
            "description": "the customers firstname",
            "required": true
        },
        "lastname": {
            "type": "string",
            "description": "the customers lastname",
            "required": true
        },
        "orders": {
            "type": "array",
            "items": {
                "type": {
                    "id": "model.Order",
                    "type": "object",
                    "description": "a order",
                    "properties": {
                        "products": {
                            "id": "model.Product",
                            "type": "object",
                            "description": "a product",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "the product name",
                                    "required": true
                                },
                                "description": {
                                    "type": "string",
                                    "description": "the product description",
                                    "required": true
                                },
                                "cost": {
                                    "type": "number",
                                    "description": "the product cost",
                                    "required": true
                                }
                            },
                            "required": true
                        }
                    }
                }
            },
            "description": "orders made by this customer",
            "required": true
        }
    }
}
```
a quick note...

when generating schema from classes:

* only public class variables will be emitted.
* all properties will be marked as "required".

when generating schema from interfaces:

* all properties will be emitted. 
* all properties will be marked as "required" unless modified with '?'.

<a name="validating_schema" />
### validating json

appex supports json schema validation from class and interface definitions. consider the following...

```javascript
interface Customer {

    firstname    : string;

    lastname     : string;

    age          : number;

    emails       : string[];

    option_a ?   : boolean; // optional

    option_b ?   : boolean; // optional

}

export function index(context) {

    // a customer with invalid data.

    var customer = {

        firstname    : 'dave',

        age          : '33',

        emails       : [12345, 'dave@domain.com', true],

        option_b     : 1,

        option_c     : 1
    }

    // do validation.

    var errors = context.schema.validate('Customer', customer);

    if(errors) {

        context.response.json(errors);
    }
}
```

will output the following.

```javascript
[
    {
        "message": "instance.lastname is required."
    },
    {
        "message": "instance.age is not a number"
    },
    {
        "message": "instance.emails[0] is not a string"
    },
    {
        "message": "instance.emails[2] is not a string"
    },
    {
        "message": "instance.option_b is not a boolean"
    },
    {
        "message": "instance.option_c unexpected property"
    }
]
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
export module model {
    
    export class Customer {

        public firstname   : string;

        public lastname    : string;

        public age         : number;
    }
}

export function index (context:appex.web.Context) {
    
    context.response.json( context.module.reflection.get('model.Customer') );
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
