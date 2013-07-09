/// <reference path="studio/references.ts" />
/// <reference path="studio/index.ts" />

import http = require('http');

export function indexs (context) { 
	
    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('home');
	
    context.response.end();
}

export function about (context)  { 
	
    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('about');
	
    context.response.end();
}


//export function wildcard(context, path) {

//    context.response.writeHead(404, {'content-type' : 'text/plain'});
	
//    context.response.write(path + ' not found');
	
//    context.response.end();
    
//}