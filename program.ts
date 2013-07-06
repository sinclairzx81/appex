/// <reference path="appex/index.ts" />

export function index(context) {
    
    context.response.write('home')

    context.response.end();
}  