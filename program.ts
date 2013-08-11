/// <reference path="node_modules/appex/appex.d.ts" />

interface Customer {

    firstname?:string;
}


cascade('index', {foo:10})
export function index(context:appex.web.IContext) {

    console.log(context.cascade)

	context.response.json(context.module.reflection)
}

export function about(context) {

	context.response.send('about')
}

export function sitemap(context) {

	context.response.send('asd')
}

export function wildcard(context) {

    context.response.send('not found')
}

