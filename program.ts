declare var JSON;

export class Customer {

    public firstName:string;

    public lastName: string;

}


 

// http:[host]:[port]/
export function index (context)  { 
	
    context.response.writeHead(404, {'content-type' : 'text/plain'});
	
    context.response.write(JSON.stringify(context.reflection, null, 4));
	
    context.response.end();
}

export function testing(context, request:Customer, callback:(response:Customer) => void) : void {

    callback(request); // echo

}