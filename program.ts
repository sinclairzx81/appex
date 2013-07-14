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
export function index (context:appex.web.IContext) {

    context.response.json(context.module.reflection);
}

/**
*   this is a method
*/
export function wildcard (context:appex.web.IContext, path:string) {

    context.response.serve("./", path);
}

