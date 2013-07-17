/// <reference path="node_modules/appex/appex.d.ts" />
/// <reference path="studio/index.ts" />

export module model {

    /** a product */
    export class Product {
        
        /** the name of the product */
        public name        : string;

        /** the product description */
        public description : string;

        /** the cost of the product */
        public cost        : number;
    } 

    /** a order */
    export class Order {
        
        /** the product being ordered */
        public products  : Product;
    }

    /** a customer */
    export class Customer {

        /** the customers firstname */
        public firstname  : string;

        /** the customers lastname */
        public lastname   : string;

        /** orders made by this customer */
        public orders     : Order[];
    }
}


export function index (context:appex.web.IContext) {

    var schema = context.schema.get('model.Customer');

    context.response.json(schema);
}

export function schema(context:appex.web.IContext) {
    
    
}



