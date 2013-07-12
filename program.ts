/// <reference path="node_modules/appex/appex.d.ts" />

export module models {
    
    export class Base {
        
        public id:string;
        
    }

    export class Customer extends Base {

        public firstname : string;

        public lastname  : string;
    }
}

export function index (context:appex.web.Context) {
    
    context.response.json( context.module.reflection.get('index') );
}
