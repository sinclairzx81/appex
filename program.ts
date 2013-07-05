declare var require;

// url: http://localhost:1337/

export function index (context:any): void { 

    //context.response.writeHead(200, {'content-type' : 'text/plain'});
    
    context.response.write('hodddme');

    context.response.end(); 
}

// url: http://localhost:1337/about

export function about (context:any): void { 

    context.response.writeHead(200, {'content-type' : 'text/plain'});
    
    context.response.write('about');

    context.response.end();
}

export module services {
    
    // url: http://localhost:1337/services/

    export function index(context:any) : void {
        
        context.response.writeHead(200, {'content-type' : 'text/plain'});
    
        context.response.write('services index');

        context.response.end(); 

    }

    // url: http://localhost:1337/services/dir

    export function dir(context:any, path:string, callback:(contents:string[]) => void) {
        
        require('fs').readdir(path || './', (error, contents) => {
            
            callback(contents);

        });
    }
}