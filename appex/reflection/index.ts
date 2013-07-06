declare var console;


export module appex.reflection {

    export function index(context) {
        
        console.log('hello from index')

        context.response.writeFile('text/html', './appex/reflection/index.html');
    }

    export function script(context) {
        
        context.response.writeFile('text/javascript', './appex/reflection/script.js');
    }

    export function data (context, request:any, callback:(response:any)=>void) { 

        callback(context.reflection);
    }
}