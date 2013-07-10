/// <reference path="studio/references.ts" />
/// <reference path="studio/index.ts" />


export module app {

    export function wildcard (context, a, b) {

        context.response.writeHead(200, {'content-type' : 'text/plain'});
	
        context.response.write(a + ' ' + b);
	
        context.response.end();
    }    
}

export function index (context) { 

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('home');
	
    context.response.end();
}

export function wildcard (context, path) {

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('not found');
	
    context.response.end();
}