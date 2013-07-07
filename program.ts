// http:[host]:[port]/
export function index   (context) { 
	context.response.writeHead(404, {'content-type' : 'text/plain'});
	context.response.write('home page');
	context.response.end();
}

// http:[host]:[port]/(.*)
export function wildcard(context, path) {
	context.response.writeHead(404, {'content-type' : 'text/plain'});
	context.response.write(path + ' page not found');
	context.response.end();
}