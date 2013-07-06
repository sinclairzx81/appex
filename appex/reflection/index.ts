export module appex.reflection {

    declare var require;

    declare var console;

    declare var JSON;

    export function index(context) {
        
        context.response.writeFile('text/html', './appex/reflection/index.html');
    }

    export function script(context) {
        
        context.response.writeFile('text/javascript', './appex/reflection/script.js');
    }

    export function data (context, request:any, callback:(response:any)=>void) { 

        callback(context.reflection);
    }

    export function wildcard (context, path) {
        
        if(path) {
            
            require('fs').readFile(path, 'utf8', (error, content) => {
                
                if(error) {
                    
                    context.response.end(); 

                    return;      
                }
                
                context.response.writeHead(200, {'content-type' : 'application/json'});

                context.response.write(JSON.stringify(content));

                context.response.end();   
                
            });

            return;
        }

        context.response.end(); 
    }
}