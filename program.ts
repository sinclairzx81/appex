/// <reference path="node_modules/appex/appex.d.ts" />

var fs = require('fs');


cascade('index', {verbs:['get', 'post']})
export function index(context) {

    context.response.send('hello');
}

export function wildcard(context, path) {
   

    context.response.send('not found');    

}