/// <reference path="tooling/reflection/appex.reflection.ts" />

export function index(context) {
    
    context.response.write('home')

    context.response.end();

}