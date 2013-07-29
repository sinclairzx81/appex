/// <reference path="node_modules/appex/appex.d.ts" />


class User {

    public firstname:string;
}

export module admin {

    export function index(context) {
    
    }

    export function dashboard(context) {
        

    }  

    export function modules(xontext){
    
    }
    export function wildcard(context, path, a, b?) {

        context.response.send('not found');    
    }

    export module users {
        
        export function login(context) { }

        export function logout(context) {}
    }
}

export module foo {

    export function anm(context) { }
}


cascade('index', {verbs:['get', 'post']})
export function index(context:appex.web.IContext) {
    
    context.response.json( context.sitemap );
}

export function about(contex) {}

export function contact(contex) {}

export function wildcard(context, path, a, b?) {

    context.response.send('not found');    

}