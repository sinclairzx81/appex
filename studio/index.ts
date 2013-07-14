/// <reference path="references.ts" />
/// <reference path="reflection/index.ts" />
/// <reference path="static/index.ts" />

export module studio {

    export function index (context:appex.web.IContext) { 
	    
        context.response.send('appex : studio index');
    }    
}