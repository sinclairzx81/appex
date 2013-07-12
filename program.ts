/// <reference path="node_modules/appex/appex.d.ts" />

declare var console;

declare var cascade;

cascade('foo', {a : 102});
export module foo{
    
    cascade('foo.index', {b : 102});
    export function index (context) { 
        
        context.response.jsonp(context.cascade);
    }
}


export function wildcard(context, path) {

    context.response.serve('./', path);
}