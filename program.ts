// <reference path="appex/index.ts" />

declare var console;

export function index(context) {
    
    context.response.write('home')

    context.response.end();
}  

export module blogs {
    
    export function index(context) {
    
        context.response.write('blogs index')

        context.response.end();       
    }

    export function wildcard(context, year:number, month, day:number) {

        console.log(year);

        context.response.write('blogs ' + year + ' ' + month + ' ' + day)

        context.response.end(); 
    }
}