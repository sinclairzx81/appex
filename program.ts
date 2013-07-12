/// <reference path="node_modules/appex/appex.d.ts" />

export function index (context:appex.web.IContext) { 
    
    context.response.send('hello');

}

export function wildcard(context, path) {

    context.response.serve('./', path);
}