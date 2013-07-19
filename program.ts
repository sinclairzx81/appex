/// <reference path="node_modules/appex/appex.d.ts" />
/// <reference path="studio/index.ts" />

class Address {

    street:string;

    address:Address[];

    constructor() {
        
    }
}

class Customer {

    public name    : string[];
    
    constructor() {
    
          this.name = [];        
    }
}


export function index (context:appex.web.IContext) {

    var customer = new Customer();

    //customer.address.address = new Address();

    



    //customer.address.address.street = null;

    var handle:any = customer;

    handle.name.push(123)

    //handle.name = 10;
    var schema = context.schema.get('Customer');

    var errors = schema.validate(customer);

    var output = JSON.stringify(customer, null, 4) + '\n';

    output += '-------------------------------\n';

    output += JSON.stringify(schema, null, 4) + '\n';

    output += '-------------------------------\n';
    
    output += JSON.stringify(errors, null, 4) + '\n';

    output += '-------------------------------\n';

    context.response.send(output);
}


