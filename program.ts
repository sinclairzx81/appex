/// <reference path="node_modules/appex/appex.d.ts" />
/// <reference path="studio/index.ts" />

class Address {
       street:string;
    constructor(){
        this.street = '123 somethere'
    }
}

class Customer {

    public name    : string;
    public address : Address[];
    constructor() {
    
          this.name = 'dave';        
    }
}


export function index (context:appex.web.IContext) {

    var customer = new Customer();

    customer.address = [new Address()];

    var handle:any = customer;

    handle.name = 10;
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


