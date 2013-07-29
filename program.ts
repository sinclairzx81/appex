/// <reference path="node_modules/appex/appex.d.ts" />

export module admin {

    export function index(context) {
    
        context.response.send('admin.index')
    }

    export function dashboard(context) {

        context.response.send('admin.dashboard')
    }

    cascade('admin.users', {roles:['users', 'administrators']})
    export module users {
        
        cascade('admin.users.login', {title:'login page'})
        export function login(context) {

            context.response.send('admin.users.login')
        }

        export function logout(context) {

            context.response.send('admin.users.logout')
        }
    }
}



cascade('index', {title:'home page'})
export function index(context) {

    console.log(JSON.stringify(context.sitemap, null, 2))

    context.response.headers['Content-Type'] = 'text/html'

	context.response.send(context.template.render('./test.txt', {sitemap:context.sitemap}))
}



