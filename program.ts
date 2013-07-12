/// <reference path="node_modules/appex/appex.d.ts" />

export module foo {
    
    export function index (context:appex.web.IContext) { 

        context.response.jsonp(context.cascade);
    }
}


export function wildcard(context, path) {

    context.response.serve('./', path);
}