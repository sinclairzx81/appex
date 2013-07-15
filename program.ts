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
    
    context.response.json( context.schema.get('models.Address') );
}


