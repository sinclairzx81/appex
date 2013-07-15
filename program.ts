/// <reference path="node_modules/appex/appex.d.ts" />
/// <reference path="studio/index.ts" />

export function index (context:appex.web.IContext) {

    context.response.send('hello.');

}



