/// <reference path="node_modules/appex/appex.d.ts" />

declare var cascade;

cascade({website:'http://mysite.com/'}) // global

cascade('index', {title:'home page'})
export function index(context) {
	context.response.send('index')
}

cascade('about', {title: 'about page'})
export function about(context) {
	context.response.send('about')
}

cascade('sitemap', {title: 'sitemap page'})
export function sitemap(context) {
	context.response.json(context.sitemap)
}

