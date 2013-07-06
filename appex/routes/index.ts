declare var console;


export module appex.routes {

    export function index(context) {
        
        context.response.writeFile('text/html', './appex/routes/index.html');
    }

    export function script(context) {
        
        context.response.writeFile('text/javascript', './appex/routes/script.js');
    }

    export function routes (context, request:any, callback:(response:any)=>void) { 

        callback(context.routes);
    }
}