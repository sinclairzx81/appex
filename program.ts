/// <reference path="studio/references.ts" />

// <reference path="studio/index.ts" />

declare var attribute;

declare var console;


attribute('application', { verbs: ['post'], message:'hel123lo' })
export module application {

    attribute('application.index',  {  verbs: ['get'], message3:'hello' })
    export function index(context) {

        context.response.writeHead(200, {'content-type' : 'text/plain'});
	
        context.response.write(JSON.stringify(context.attribute, null, 4));
	
        context.response.end();
    }
}

export function index (context) { 

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('home');
	
    context.response.end();
}

export function data (context) { 
    
    console.log(context.module);

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('data');
	
    context.response.end();
}

export function wildcard (context, path) {

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('not found');
	
    context.response.end();
}