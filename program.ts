/// <reference path="node_modules/appex/appex.d.ts" />

declare var cascade;

cascade('index', {title:'home page'})
export function index(context) {

	context.response.send('index')
}

cascade('about', {title: 'about page'})
export function about(context) {

	context.response.send('about')

}

function test(context) {

    context.next()
}

cascade('sitemap', {title: 'sitemap pages', use:[test]})
export function sitemap(context) {

	context.response.json(context.sitemap)
}