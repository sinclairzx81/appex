/// <reference path="../references.ts" />

var fs = require("fs");

export module studio.reflection {

    export function index(context:appex.web.IContext) {
        
        context.response.serve('./studio/reflection/index.html');
    }

    export function data (context:appex.web.IContext) { 

        context.response.json(context.module.reflection)
    }

    export module files {

        export function wildcard (context:appex.web.IContext, path) {

            context.response.headers["Content-Type"] = 'text/plain'

            context.response.serve('./', path);
        }    
    }
}