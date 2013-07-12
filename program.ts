/// <reference path="node_modules/appex/appex.d.ts" />

export module models {
    
    export class Customer {

        public firstname : string;

        public lastname  : string;
    }
}

export function index (context:appex.web.Context) {
    


    context.response.json(context.module.reflection.get('models.Customer'));
}
