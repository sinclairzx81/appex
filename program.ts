///// <reference path="studio/references.ts" />
///// <reference path="studio/index.ts" />

//import http = require("http");

declare var console;

export module blog {

    export function wildcard(context, year:number, month:number, day?:number) {

        console.log('year : ' + year);

        console.log('month : ' + month);

        console.log('day : ' + day);
        
        context.response.writeHead(200, {'content-type' : 'text/plain'});
	
        context.response.write('m wild');
	
        context.response.end();

    }
}

//attribute("index", {data:10});
//export function index (context) { 

//    console.log(context.attribute)

//    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
//    context.response.write('home');
	
//    context.response.end();
//}


export function wildcard (context, a) {

    context.response.writeHead(200, {'content-type' : 'text/plain'});
	
    context.response.write('not found');
	
    context.response.end();
}