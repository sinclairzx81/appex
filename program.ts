/// <reference path="node_modules/appex/appex.d.ts" />

cascade('index', {verbs:['get', 'post']})
export function index(context:appex.web.IContext) {

    context.response.send(context.template.render('./app.js'));
}

export function wildcard(context, path) {

    context.response.send('not found');    

}