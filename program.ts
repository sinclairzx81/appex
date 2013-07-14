/// <reference path="node_modules/appex/appex.d.ts" />

export module models {
    
    export class Customer {

        public firstname   : string;

        public lastname    : string;

        public age         : number;
    }
}

/**
*   this is a method
*/
export function index (context:appex.web.Context) {
    
    context.response.cookies.set('cookie0', 'this is cookie 0');

    context.response.cookies.set('cookie1', 'this is cookie 1');

    context.response.json(context.module.reflection);
}

