/// <reference path="node_modules/appex/appex.d.ts" />

declare var cascade;
declare var console;

cascade({data : 22})

cascade('foo', {a : 102});
export module foo {
    
    cascade('foo.index', {b : 102});
    export function index (context) { 
        
        console.log(cascade('foo'));

        context.response.jsonp(context.cascade);
    }
}


export function wildcard(context, path) {

    context.response.serve('./', path);
}