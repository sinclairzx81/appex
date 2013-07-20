/// <reference path="studio/index.ts" />
/// <reference path="node_modules/appex/appex.d.ts" />
 
interface Address {
    
}

interface Customer {
    
    firstname ? : string;

    lastname   : string;

    address    : any[];

    something  : Date;
}

export function index (context:appex.web.IContext) {

    var customer        = {};// new Customer();

    var handle:any      = customer;

    handle.firstname    = 1;

    handle.lastname     = 'smith';

    handle.address      = [1];

    handle.something = new Date();

    //---------------------------------------------
    // output
    //---------------------------------------------
    var schema = context.schema.generate('Customer');
    var errors = context.schema.validate('Customer', customer);
    var output = JSON.stringify(customer, null, 4) + '\n';
    output += '-------------------------------\n';
    output += JSON.stringify(schema, null, 4) + '\n';
    output += '-------------------------------\n';
    output += JSON.stringify(errors, null, 4) + '\n';
    output += '-------------------------------\n';
    context.response.send(output);
}


