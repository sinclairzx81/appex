# appex

typescript integrated into nodejs. 

## install

```javascript
npm install appex
```

## example usage

```javascript

// app.js

var appex = require('appex');
 
var compiler = new appex.Compiler();

compiler.compile("./program.ts", function(compilation) {
    
	var module = new appex.Module(compilation.script, compilation.reflection);

	for(var n in module.handles) {

		console.log( module.handles[n] ); // write type information to the console.
	}

});

```

```javascript

// program.ts

export module application {

	export class Program {

		constructor() {
			
			
		}
	}

}

```