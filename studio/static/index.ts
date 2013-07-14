/// <reference path="../references.ts" />

export module studio.static {

    export function wildcard(context:appex.web.IContext, path) {

        context.response.serve('./studio/static/', path);
    }
}