/// <reference path="node_modules/appex/appex.d.ts" />

export function index(context) {
    
    context.response.headers['Content-Type'] = 'text/html';

    context.response.send('hi terhe');
}

