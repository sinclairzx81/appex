/// <reference path="node_modules/appex/appex.d.ts" />


cascade({website:'http://mysite.com/'}) // global

export function index(context) {

    console.log(context.cascade)

	context.response.send('index')
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

