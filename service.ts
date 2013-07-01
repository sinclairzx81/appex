/// <reference path="node_modules/appex/decl/node.d.ts" />

var fs = <fs>require('fs');

export module services
{   
    export class customers
    {   
        public context : any;

        public list(input:any, callback: (output:any) => void) : void {
            
            fs.readdir('./', (err, files) =>{
            
                callback(files);

            });
        }

        public add(input:any, callback: (output:any) => void) : void {

            console.log('invoked customers.add');
            
            callback(input);

        }

        public remove(input:any, callback: (output:any) => void) : void {

            this.context.response.writeHead(200, {'content-type' : 'text/plain'});

            this.context.response.write('intercepted');

            this.context.response.end();
        }

        public update(input:any) : any {

            console.log('invoked customers.update');

           return input;
        }
    }
}
