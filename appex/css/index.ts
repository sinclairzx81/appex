export module appex.css {
    
    export function site(context) {
    
        context.response.writeFile('text/css', './appex/css/site.css');
    }
}