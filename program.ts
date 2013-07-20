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

	var customer = {
		firstname    : 'dave',
		age          : '33',
        emails       : [12345, 'dave@domain.com', true],
		option_b     : 1
	}

	var errors = context.schema.validate('Customer', customer);

	if(errors.length > 0) { // there are validation errors
		
		context.response.json(errors);
	}
}