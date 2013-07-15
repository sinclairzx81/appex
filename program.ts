/// <reference path="node_modules/appex/appex.d.ts" />
/// <reference path="studio/index.ts" />

export module models {

	export class User {
        
        public firstname : string;
        /** users last name */
        public lastname  : string;

        public friends   : User[];
	}
}

export function index (context:appex.web.IContext) {

    context.response.json( context.schema.get('models.User') );
}


