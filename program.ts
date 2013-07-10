/// <reference path="studio/references.ts" />
/// <reference path="studio/index.ts" />

attribute("index", {data:10});
export function index (context) { 

    console.log(context.attribute)

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('home');
	
    context.response.end();
}

export function wildcard (context, a) {

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('not found');
	
    context.response.end();
}