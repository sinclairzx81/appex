/// <reference path="studio/references.ts" />
/// <reference path="studio/index.ts" />

attribute("index", {data:10});
export function index (app) { 

    console.log(app.attribute)

    app.response.writeHead(200, {'content-type' : 'text/plain'});
	
    app.response.write('home');
	
    app.response.end();
}

attribute("about", {data:10});
export function about(app) {

    app.response.writeHead(200, {'content-type' : 'text/plain'});
	
    app.response.write('about');
	
    app.response.end();
    
}

attribute("Wildcard", {data:10});
export function wildcard (app, a) {
    
    index(app);
    
    app.response.writeHead(200, {'content-type' : 'text/plain'});
	
    app.response.write('not found');
	
    app.response.end();
}