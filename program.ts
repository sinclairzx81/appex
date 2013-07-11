/// <reference path="node_modules/appex/appex.d.ts" />

export function index (app:appex.web.app.IApp) { 
    
    app.response.send(200, 'hello');
}

export function about(app:appex.web.app.IApp) {
    
    app.response.jsonp(app.request.method());
}

export function wildcard (app:appex.web.app.IApp, path) {
    
    app.response.serve("./", path);
}