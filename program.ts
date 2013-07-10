/// <reference path="studio/references.ts" />
/// <reference path="studio/index.ts" />

attribute("index", {data:10});
export function index (context) { 

    console.log(context.attribute)

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('home');
	
    context.response.end();
}

export module app {

    export function wildcard (context, a, b) {

        context.response.writeHead(200, {'content-type' : 'text/plain'});
	
        context.response.write(a + ' - ' + b);
	
        context.response.end();
    }    
}


export function wildcard (context, path) {

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write(path + ' not found');
	
    context.response.end();
}