![](https://raw.github.com/sinclairzx81/appex/master/assets/logo.jpg)

### develop nodejs web services with typescript

## install

```javascript
npm install appex
```

* [overview](#overview)
* [getting started](#getting_started)
* [getting started on express](#getting_started_on_express)
* [function signatures](#function_signatures)
	* [http handler](#function_signatures_http_handler)
	* [json handler](#function_signatures_json_handler)
* [function visibility](#function_visibility)
* [function routing](#function_routing)


<a name="overview" />
## overview

Appex is a nodejs web application and service framework built on top of the TypeScript programming language. Appex 
enables nodejs developers to expose typescript functions as http endpoints as well as generate meaningful service
meta data for clients who consume them. 


<a name="getting_started" />
## getting started
```javascript
//----------------------------------------------
// file: program.ts
//----------------------------------------------
export module services {
	
	// url: http://localhost:3000/services/message
	export function message (context:any): void { 
		
		context.response.write('hello typescript');

		context.response.end(); 
	}
}
//----------------------------------------------
// file: app.js
//----------------------------------------------

var appex   = require('appex');

var runtime = appex.runtime ({ source : './program.ts', devmode : true });

require('http').createServer( runtime ).listen(3000);
```
<a name="getting_started_on_express" />
## getting started on express
```javascript
//----------------------------------------------
// file: program.ts
//----------------------------------------------
export module services {
	
	// url: http://localhost:3000/services/message
	export function message (context:any): void { 
		
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

app.use( appex.runtime( { source:'./program.ts', devmode:true } ) );

app.get('/', function(req, res){

  res.send('Hello World');
  
});

app.listen(3000);
```

<a name="function_signatures" />
## function signatures

Appex supports two distinct function signatures. http handler signatures and json handler signatures.

<a name="function_signatures_http_handler" />
### http handler signature

A http handler method can be created with the following function signature. The context
argument contains the http request and response objects.

```javascript
export function method(context:any) : void {

	context.response.write('hello world');
	
	context.response.end();

}
```
<a name="function_signatures_json_handler" />
### json handler signature

A json handler function is a function which will automatically accept a HTTP POST'ed json string and 
pass it to the function as a object parameter. in addition, json handler functions also require that 
a response object be returned on the callback, which in turn will be passed back as a http response
as a json string.

A http handler method can be created with the following function signature. The context
argument contains the http request and response objects.

```javascript
export function method(context:any, request:any, callback:(response:any) => void) {

	callback(request); // echo

}
```
<a name="function_routing" />
## function routing

Appex creates url routing tables based on a function name and module scope. For example consider the following...

```javascript
export function index   (context:any) { }

export function about   (context:any) { }

export function contact (context:any) { }

export module services.customers {

	export function insert(context:any) : void { }
	
	export function update(context:any) : void { }
	
	export function delete(context:any) : void { }
}
```

will create the following routes:

```javascript
http://[host]:[port]/

http://[host]:[port]/about

http://[host]:[port]/contact

http://[host]:[port]/services/customers/insert

http://[host]:[port]/services/customers/update

http://[host]:[port]/services/customers/delete
```
<a name="function_visibility" />
## function visibility

Appex only exposes 'exported' functions over http. From this developers infer notions of public and private over http. 

Consider the following example:

```javascript

module private_module {

	export function public_method () {
	
		// this function is exported, but as this module is 
		
		// not exported, neither is this method.
	}
}

function private_function() {

	// this method is private
}

export function public_function   (context:any) { 

	private_function(); // ok
	
	private_module.public_method(); // ok
}
```

will result in the following routes.

```javascript
http://[host]:[port]/public_function
```


