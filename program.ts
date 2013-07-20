/// <reference path="node_modules/appex/appex.d.ts" />
/// <reference path="studio/index.ts" />

 
interface Address {


}

interface Customer {

    address:string[];
   
    
    
   
}


export function index (context:appex.web.IContext) {

    var customer:any = {};

    customer.address = [1];//'haydn';

    //customer.lastname = 'haydn';

    //customer.address = ['asd'];

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


