/// <reference path="node_modules/appex/appex.d.ts" />
/// <reference path="studio/index.ts" />

export module models {

	export class Node {
            
        public child_nodes: Node[];
	}
}

export function index (context:appex.web.IContext) {

    context.response.json( context.schema.get('models.Node') );
}


