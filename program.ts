/// <reference path="lib.d.ts" />
/// <reference path="node.d.ts" />

/// <reference path="appex/index.ts" />

import http = require('http');

export function index (context)  { 
	
    context.response.writeHead(404, {'content-type' : 'text/plain'});
	
    context.response.write(JSON.stringify(context.reflection, null, 4));
	
    context.response.end();
}

export function wildcard(context, path) {

    context.response.writeHead(404, {'content-type' : 'text/plain'});
	
    context.response.write(path + 'not found');
	
    context.response.end();
    
}

export module data {

    class Customer {
    
        public firstName : string;
    }
}

