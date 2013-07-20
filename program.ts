/// <reference path="studio/index.ts" />
/// <reference path="node_modules/appex/appex.d.ts" />
 

interface Address {

    line1    : string;
    addresses:Address[];
}

class Customer {

    public address   : Address[];
}

export function index (context:appex.web.IContext) {

    var customer = new Customer();

    var handle:any = customer;

    
    handle.address = [{line1:'a', addresses:[1]}];












    //---------------------------------------------
    // output
    //---------------------------------------------
    var schema = context.schema.get('Customer');
    var errors = context.schema.validate('Customer', customer);
    var output = JSON.stringify(customer, null, 4) + '\n';
    output += '-------------------------------\n';
    output += JSON.stringify(schema, null, 4) + '\n';
    output += '-------------------------------\n';
    output += JSON.stringify(errors, null, 4) + '\n';
    output += '-------------------------------\n';
    context.response.send(output);
}


