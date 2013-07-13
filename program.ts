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
    
    context.request.cookies.get('name', 'value', {expires: 1000})

    context.response.json(context.module.reflection);
}

