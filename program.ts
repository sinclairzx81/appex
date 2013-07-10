/// <reference path="studio/references.ts" />

/// <reference path="studio/index.ts" />

declare var attribute;

declare var console;

attribute("index", {  verbs: ["get", "post"] });

export function index (context) { 
    
    console.log(context.module);

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('home');
	
    context.response.end();
}

export function about (context)  {
    
    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('about');
	
    context.response.end();
}

attribute("data", { verbs: [ "post"], roles: ["administrators"] });

export function data (context, request:any, callback:(response:any)=>void) { 

    callback(context.module.reflection);
}

attribute("wildcard", { verbs: ["get", "post"], roles: ["administrators"] });

export function wildcard(context, path) {

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('not found');
	
    context.response.end();   
}

attribute("admin", {  verbs: ["get"]  } );

export module admin {

    attribute("admin.index", {  verbs: ["get"]  });

    export function index (context) { 
    
        context.response.writeHead(200, {'content-type' : 'text/plain'});
	
        context.response.write('home');
	
        context.response.end();
    }
}