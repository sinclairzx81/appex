/// <reference path="references.ts" />
/// <reference path="reflection/index.ts" />
/// <reference path="static/index.ts" />

export module studio {

    export function index (app) { 
	    
        app.response.writeHead(200, {'content-type' : 'text/plain'});
	
        app.response.write('appex-studio');
	
        app.response.end();
    }    
}