export module appex.routes {

    declare var require;

    declare var console;

    declare var JSON;

    export class Customer<T> {

        public firstName : T;

        public lastName  : T;
        
    }

    export function method(context, request:string, callback:(response:Customer<string>) => void ) {
    
        for(var n in context.routes) {
        
             if(context.routes[n].path == '/appex/routes/method') {
                
                 console.log(context.routes[n])
                  callback(context.routes[n].outputType)    

            }
        }    
        
       
    }

    export function index(context) {
        

        
       

        context.response.writeFile('text/html', './appex/routes/index.html');
    }

    export function script(context) {
        
        context.response.writeFile('text/javascript', './appex/routes/script.js');
    }

    export function data (context, request:any, callback:(response:any)=>void) { 



        callback(context.routes);
    }

}