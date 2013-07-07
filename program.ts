/// <reference path="appex/index.ts" />

declare var console;



export function index(context) {
    
    context.response.write('home')

    context.response.end();
}  

export module static {

    declare var require;

    declare var fs;

    export function wildcard(context, path) {
                  
        require('fs').readFile('./node_modules/' + path, 'utf8', (error, content) => {
                
            if(error) {
                
                context.response.writeHead(404, {'content-type' : 'text/plain'});

                context.response.write('page not found');

                context.response.end(); 

                return;
            }

            context.response.writeHead(200, {'content-type' : 'text/plain'});

            context.response.write(content);

            context.response.end();
        });          
    }
}

export module blogs {
    
    export function index(context) {
    
        context.response.write('blogs index')

        context.response.end();       
    }

    export function wildcard(context, year:number, month, day:number) {

        console.log(year);

        context.response.write('blogs ' + year + ' ' + month + ' ' + day)

        context.response.end(); 
    }
}