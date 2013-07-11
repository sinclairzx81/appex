/// <reference path="node_modules/appex/appex.d.ts" />


declare var attribute;

export function index (app:appex.web.app.IApp) { 
    
    app.response.json(app.attribute);
}


export function about(app:appex.web.app.IApp) {
    
    app.response.jsonp(app.request.method());
}

export function wildcard (app:appex.web.app.IApp, path) {
    
    app.response.serve("./", path);
}