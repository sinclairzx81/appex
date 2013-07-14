/// <reference path="node_modules/appex/appex.d.ts" />
/// <reference path="studio/index.ts" />

export module models {

	export class Address {

		public addressLine1: string;
		
        public addressLine2: string;
		
        public addressLine3: string;
	}
	
	export class User {
		
        public id : string;
	}

	export class Customer extends User {

		public firstname : string;
		
        public lastname  : string;
		
        public age       : number;
		
        public addresses : Address[];
	}
}

export function index (context:appex.web.IContext) {
    
    

    context.response.json( context.module.reflection.schema('models.Customer') );
}
