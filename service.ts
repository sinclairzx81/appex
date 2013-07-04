/// <reference path="node_modules/appex/references/node.d.ts" />
/// <reference path="bin/appex.d.ts" />

var appex = require('appex');

export module app 
{
    export class Customer {
    
        public firstName: string;

        public lastName : string;
    }

    export class Example extends appex.Controller {   

        public get(request:string, callback : (response:app.Customer) => void) : void {
            
            callback(null);
            
        }
        public post(request:string, callback : (response:string) => void) : void {
            
            callback(request);
            
        }
        public put(request:string, callback : (response:string) => void) : void {
            
            callback(request);
            
        }

        public delete(request:string, callback : (response:string) => void) : void {
            
            callback(request);
            
        }
    }    
}