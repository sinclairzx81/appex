/// <reference path="studio/references.ts" />

// <reference path="studio/index.ts" />

declare var attribute;

attribute('foo', {a : 10})
export module foo {

    attribute('foo.bar', {b : 20})
    export module bar {
            
        attribute('foo.bar.index', {c : 30})
        export function index(context) {
        
            // context.attribute
            //{
            //    "a": 10,
            //    "b": 20,
            //    "c": 30
            //}            

            context.response.writeHead(200, {'content-type' : 'text/plain'});
	
            context.response.write(JSON.stringify(context.attribute, null, 4));
	
            context.response.end();
                
        }

    }
}




export function index (context) { 

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('home');
	
    context.response.end();
}

export function data (context) { 
    
    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('data');
	
    context.response.end();
}

export function wildcard (context, path) {

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('not found');
	
    context.response.end();
}