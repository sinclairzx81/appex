/// <reference path="../references.ts" />

import fs = require('fs');

export module studio.static {

    var static_dir = './studio/static/';

    export function wildcard(app, path) {
        
        var not_found = () => {

            app.response.writeHead(404, {'content-type' : 'text/plain'});

            app.response.write(path + ' not found.');

            app.response.end();         
        };

        if(path.indexOf('..') !== -1) {
        
            not_found();

            return;
        }

        path = static_dir + path;
        
        fs.exists(path, (exists) =>{

            if(!exists) {
                
                not_found();

                return;
            }

            fs.readFile(path, (err, data) => {
                
                app.response.writeHead(200, {'content-type' : app.mime.lookup(path) });

                app.response.write(data);

                app.response.end();
            });
        }); 
    }
}