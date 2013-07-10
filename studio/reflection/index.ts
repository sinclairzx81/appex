/// <reference path="../references.ts" />

var fs = require("fs");

export module studio.reflection {

    export function index(context) {
        
        fs.readFile('./studio/reflection/index.html', (err, data) => {
        
            context.response.writeHead(200, {'content-type' : 'text/html'});

            context.response.write(data);

            context.response.end();
        });
    }

    export function data (context) { 

        context.response.writeHead(200, {'content-type' : 'application/json'});

        context.response.write(JSON.stringify(context.module.reflection, null, 4));

        context.response.end();
    }

    export function wildcard (context, path) {

        var not_found = () => {
        
            context.response.writeHead(404, {'content-type' : 'text/plain'});

            context.response.write('studio reflection asset not found');

            context.response.end();         
        
        };

        if(path) {
            
            fs.readFile(path, 'utf8', (error, content) => {
                
                if(error) {
                    
                    not_found();

                    return;      
                }
                
                context.response.writeHead(200, {'content-type' : 'application/json'});

                context.response.write(JSON.stringify(content));

                context.response.end();   
                
            });

            return;
        } else {

            not_found();
        }
    }
}