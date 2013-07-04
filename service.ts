/// <reference path="node_modules/appex/references/node.d.ts" />
/// <reference path="bin/appex.d.ts" />

var appex = require('appex');

export class App extends appex.Controller {   

    public index  (request:string, callback:(response:string) => void ): void {
    
        this.response.writeHead(200, {'content-type': 'text/plain'})

        this.response.write('hello world');

        this.response.end();
    }

    public get    (request:string, callback : (response:string) => void) : void {
            
        callback(null);
            
    }
    public post   (request:string, callback : (response:string) => void) : void {
            
        callback(request);
            
    }
    public put   (request:string, callback : (response:string) => void) : void {
            
        callback(request);
            
    }

    public delete (request:string, callback : (response:string) => void) : void {
            
        callback(request);
            
    }
}
