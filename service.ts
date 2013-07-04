/// <reference path="node_modules/appex/references/node.d.ts" />

export class App {
    
    constructor() {
        
        console.log('hello')
    
    }
}

export var num:string = "hello";

export module app {
   
    export class Base {
            
                
    }

    export class App extends Base {
    
        constructor() {

            super();

            console.log('nested')
            
        }
    }    
}