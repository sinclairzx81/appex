/// <reference path="node_modules/appex/decl/node.d.ts" />


class Foo implements app.Item {

    value:string;
}


export module app {

    var fs = require('fs');

    export interface Item {

        value:string;

    }

    export interface Address 
    {
        street : string;

        app    : app.Item;
    }

    export interface Customer
    {
        firstname: string;

        lastname : string;

        address  : app.Address;
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

        public add(input:app.Customer, callback: (output:app.Customer) => void) : void {

            console.log('invoked customers.add');
            
            callback(input);
        }

        public remove(input:any, callback: (output:any) => void) : void {

            console.log('invoked customers.remove');

            this.context.response.writeHead(200, {'content-type' : 'text/plain'});

            this.context.response.write('intercepted');

            this.context.response.end();
        }

        private update(input:string) : any {

            console.log('invoked customers.update');

            return input;
        }
    }
}
