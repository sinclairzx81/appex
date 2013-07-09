///// <reference path="lib.d.ts" />
///// <reference path="node.d.ts" />
///// <reference path="appex/index.ts" />

//import http = require('http');

export function index (context) { 
	
    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('home');
	
    context.response.end();
}

export function about (context)  { 
	
    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('about');
	
    context.response.end();
}

export function method(context, request, callback:(response)=>void)  {
    
    callback('asd')
}

export function wildcard(context, path) {

    context.response.writeHead(404, {'content-type' : 'text/plain'});
	
    context.response.write(path + ' not found');
	
    context.response.end();
    
}

declare var console;
declare var JSON;

export module test {

    export function wildcard(context, a, b) {
        
        console.log(context)

        context.response.writeHead(404, {'content-type' : 'text/plain'});
	
        context.response.write(context.module.javascript);
	
        context.response.end();        
    }
}

