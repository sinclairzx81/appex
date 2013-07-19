/// <reference path="node_modules/appex/appex.d.ts" />
/// <reference path="studio/index.ts" />

 

interface Customer {

    customers ? : Customer[];

    
    
   
}


export function index (context:appex.web.IContext) {

    //var customer = new Customer();

    var customer:any = {};//<Customer>{};

    customer.customers = [1];

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


