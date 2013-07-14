/// <reference path="node_modules/appex/appex.d.ts" />
/// <reference path="studio/index.ts" />

export function index (context:appex.web.IContext) {

    context.response.json(context.module.reflection);
}

export function wildcard (context:appex.web.IContext, path:string) {

    context.response.serve("./", path);
}

