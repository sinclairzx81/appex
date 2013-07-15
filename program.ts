/// <reference path="node_modules/appex/appex.d.ts" />
/// <reference path="studio/index.ts" />

export module models {

	export class Address {

        /** street */
		public addressLine1: string;
        /** suburb */		
        public addressLine2: string;
	}
	
	export class User {

		/** this users id */
        public id : string;
	}

    export class Customer extends User {
        
        /** the customers firstname */
		public firstname  : string;
		
        /** the customers lastname */
        public lastname   : string;
    }

	export class Employee extends User {

        /** the employees firstname */
		public firstname  : string;
		
        /** the employees lastname */
        public lastname   : string;
		
        /** the employees address */
        public address  : Address;

        /** this employees customers */
        public customers : Customer[];
	}
}

export function index (context) {
    
    context.response.json( context.schema.get('models.Employee') );
}

export function data(context) {

    var employee = new models.Employee();
    employee.id                   = "123";
    employee.firstname            = "dave";
    employee.lastname             = "smith";
    employee.address              = new models.Address();
    employee.address.addressLine1 = "17 wildbird lane";
    employee.address.addressLine2 = "Duckworth";

    var customer       = new models.Customer();
    customer.id        = "321";
    customer.firstname = "sam";
    customer.lastname  = "fisher";
    employee.customers = [customer];

    context.response.json(employee);
}


