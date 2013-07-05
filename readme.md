![](https://raw.github.com/sinclairzx81/appex/master/assets/logo.jpg)

## install

```javascript
npm install appex
```

* [overview](#overview)
* [http functions](#http_functions)
* [function routing](#function_routing)
* [public and private functions](#public_private)

<a name="overview" />
## overview

Appex is a nodejs web application and service framework built on top of the TypeScript programming language. Appex 
enables nodejs developers to expose typescript functions as http endpoints as well as generate meaningful service
meta data for clients who consume them. 

### typescript

```javascript
// program.ts

declare var require; 

// url: http://localhost:1337/
export function index (context:any): void { 
  
    context.response.write('home');

    context.response.end(); 
}

// url: http://localhost:1337/about
export function about (context:any): void { 
	
    context.response.write('about');

    context.response.end();
}

export module services {

    // url: http://localhost:1337/services/dir
    export function dir(context:any, path:string, callback:(contents:string[]) => void) {
        
        require('fs').readdir(path || './', (error, contents) => {
            
            callback(contents);

        });
    }
}

```

### javascript

```javascript
// app.js

var appex   = require('appex');

var runtime = appex.runtime ({ source : './program.ts', devmode : true });

require('http').createServer( function(request, response) {
    
    runtime(request, response);
    
}).listen(5444);
```
<a name="http_functions" />
## http functions

Appex supports two types of http endpoints, http handlers and json service methods. 

### http handler methods

A standard request response handler method can be created with the following method signature. the context
contains the standard node http request and response objects.

A http handler method can be created with the following method signature.

```javascript
export function method(context:any) : void {

	context.response.write('hello world');
	
	context.response.end();

}
```

### json service methods

Json service methods are http endpoints whose request and responses are POST'ed to them. Json service
methods automatically parse incoming json requests as well as stringify-ing the response. the context
contains the standard node http request and response objects.

A json service method can be created with the following method signature.

```javascript
export function method(context:any, request:string, callback:(response:any) => void) {

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
<a name="public_private" />
## public and private functions

Appex only exposes 'exported' functions over http. From this developers infer notions of public and private over http. consider
the following example.

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


