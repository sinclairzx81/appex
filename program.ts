/// <reference path="node_modules/appex/appex.d.ts" />

declare var console;

declare var attribute;

attribute('foo', {dasta:102});
export module foo{


    attribute('foo.index', {data:102});
    export function index (context) { 
    
    

        context.response.jsonp(context.attribute);
    }
}


export function wildcard(context, path) {

    context.response.serve('./', path);
}