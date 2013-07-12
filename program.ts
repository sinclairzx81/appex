/// <reference path="node_modules/appex/appex.d.ts" />

function authenicate(context:appex.web.IContext){

    console.log('authenicate');

    context.next();
}

function authorize(context:appex.web.IContext) {

    console.log('authorize');

    context.next();
}

cascade({ use : [ authenicate, authorize ] })

export function index (context:appex.web.IContext) { 
        
    console.log(context.cascade);

    context.response.send('index')

}

cascade('about', { use : [ ] })
export function about (context:appex.web.IContext) { 
        
    console.log(context.cascade);

    context.response.send('index')

} 

export function wildcard(context, path) {

    console.log(context.cascade)

    context.response.serve('./', path);
}