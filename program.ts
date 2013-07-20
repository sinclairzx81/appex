/// <reference path="studio/index.ts" />
/// <reference path="node_modules/appex/appex.d.ts" />
 

interface Customer {

    firstname    : string;

    lastname     : string;

    age          : number;

    emails       : string[];

    option_a ?   : boolean; // optional

    option_b ?   : boolean; // optional

}

export function index(context) {

    // a customer with invalid data.

    var customer = {

        firstname    : 'dave',

        age          : '33',

        emails       : [12345, 'dave@domain.com', true],

        option_b     : 1,

        option_c     : 1
    }

    // do validation.

    var errors = context.schema.validate('Customer', customer);

    if(errors) {

        context.response.json(errors);
    }
}

