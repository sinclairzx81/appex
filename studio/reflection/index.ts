/// <reference path="../references.ts" />

import fs = require('fs')

export module studio.reflection {

    export function index(context) {
        
        fs.readFile('./studio/reflection/index.html', (err, data) => {
        
            context.response.writeHead(200, {'content-type' : 'text/html'});

            context.response.write(data);

            context.response.end();
        });
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