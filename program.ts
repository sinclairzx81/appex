/// <reference path="appex/index.ts" />
// <reference path="node_modules/appex/index.ts" />
export function index(context) {
    
    context.response.write('home')

    context.response.end();
}  