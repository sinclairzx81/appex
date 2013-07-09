/// <reference path="../references.ts" />

import fs = require('fs')

export module studio.reflection {

    export function index(context) {
        
        var stream = fs.createReadStream('./studio/reflection/index.html')

        context.response.writeHead(200, {'content-type' : 'text/html'});

        stream.pipe(context.response);
    }

    export function script(context) {
        
        var stream = fs.createReadStream('./studio/reflection/script.js')

        context.response.writeHead(200, {'content-type' : 'text/javascript'});

        stream.pipe(context.response);
    }

    export function data (context, request:any, callback:(response:any)=>void) { 

        callback(context.module.reflection);
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