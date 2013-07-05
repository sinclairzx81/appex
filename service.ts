export function index(context:any): void {

    context.response.writeHead(200, {'content-type' : 'text/plain'});
    
    context.response.write('hello there');

    context.response.end();

}