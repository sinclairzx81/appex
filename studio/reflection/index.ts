/// <reference path="../references.ts" />

var fs = require("fs");

export module studio.reflection {

    export function index(app) {
        
        fs.readFile('./studio/reflection/index.html', (err, data) => {
        
            app.response.writeHead(200, {'content-type' : 'text/html'});

            app.response.write(data);

            app.response.end();
        });
    }

    export function data (app) { 

        app.response.writeHead(200, {'content-type' : 'application/json'});

        app.response.write(JSON.stringify(app.module.reflection, null, 4));

        app.response.end();
    }

    export function wildcard (app, path) {

        var not_found = () => {
        
            app.response.writeHead(404, {'content-type' : 'text/plain'});

            app.response.write('studio reflection asset not found');

            app.response.end();         
        
        };

        if(path) {
            
            fs.readFile(path, 'utf8', (error, content) => {
                
                if(error) {
                    
                    not_found();

                    return;      
                }
                
                app.response.writeHead(200, {'content-type' : 'application/json'});

                app.response.write(JSON.stringify(content));

                app.response.end();   
                
            });

            return;
        } 
        else 
        {
            not_found();
        }
    }
}