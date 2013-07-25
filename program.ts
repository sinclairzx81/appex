/// <reference path="node_modules/appex/appex.d.ts" />

export function index(context:appex.web.IContext) {
    
    var code = context.template.render('./app.js', null);

    context.response.send(code);
}

