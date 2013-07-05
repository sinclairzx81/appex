export function index   (context) { 
    context.response.writeHead(200, {'content-type' : 'text/plain'});
    context.response.write('index');
    context.response.end();
}

export function about   (context) { 
    context.response.write('about');
    context.response.end();
}

export function contact (context)  { 
    context.response.write('contact');
    context.response.end();
}