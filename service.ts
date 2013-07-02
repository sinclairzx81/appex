/// <reference path="node_modules/appex/decl/node.d.ts" />

var fs    = <fs>require('fs');

export module services
{   
    export class Address 
    {
        public street:string;
    }

    export class Customer
    {
        public firstname: string;
        public lastname : string;
        public address  : services.Address;
    }

    export class Customers  
    {   
        public context : any;

        public list(input:any, callback: (output:any) => void) : void {
            
            console.log('invoked customers.list');

            fs.readdir('./', (err, files) => {
            
                callback(files);

            });
        }

        public add(input:services.Customer, callback: (output:Customer) => void) : void {

            console.log('invoked customers.add');
            
            callback(input);
        }

        public remove(input:any, callback: (output:any) => void) : void {

            console.log('invoked customers.remove');

            this.context.response.writeHead(200, {'content-type' : 'text/plain'});

            this.context.response.write('intercepted');

            this.context.response.end();
        }

        private update(input:any) : any {

            console.log('invoked customers.update');

            return input;
        }
    }
}
