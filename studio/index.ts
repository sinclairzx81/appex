/// <reference path="references.ts" />
/// <reference path="static/index.ts" />
/// <reference path="reflection/index.ts" />


export module studio {

    export function index (context) { 
	    
        context.response.writeHead(200, {'content-type' : 'text/plain'});
	
        context.response.write('appex-studio');
	
        context.response.end();
    }    
}