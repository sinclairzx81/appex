/// <reference path="node_modules/appex/appex.d.ts" />

cascade({ message: 'global message' })


cascade('index', { message: 'index message' })
export function index (context:appex.web.IContext) { 
        
    console.log(context.cascade);

    context.response.send('inssdex')

}
cascade('app', { use:[index] })
export module app {


    export function index (context:appex.web.IContext) { 
        
        console.log(context.cascade);

        context.response.send('index')

    }
    
}

export function wildcard(context, path) {

    //console.log(context.cascade)

    context.response.serve('./', path);
}
