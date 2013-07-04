/// <reference path="node_modules/appex/references/node.d.ts" />
/// <reference path="bin/appex.d.ts" />

var appex = <appex>require('appex');

export module app 
{
    export class Example extends appex.Service 
    {   
        //app/example/synchronous 
        public synchronous(request:any) : any 
        {
            return request;
        }

        //app/example/asynchronous 
        public asynchronous(request:string, callback : (response:string) => void) : void {
            
            callback(request);
            
        }

        //app/example/override 
        public override(request:string, callback : (response:string) => void) : void {
        
            this.response.writeHead(200, {'content-type' : 'text/plain'});

            this.response.write('overriding by not calling the callback.')

            this.response.end();
        }

        //app/example/io 
        public io (request:string, callback : (response:string[]) => void) : void {

            var fs = <fs>require('fs');

            fs.readdir('./', (err, contents) => {
                
                callback(contents);

            });
        }
    }    
}