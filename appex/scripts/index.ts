export module appex.scripts {

    export function api(context)  : void {
    
        context.response.writeFile('text/javascript', './appex/scripts/api.js');
    
    }

    export function next(): void {
    
        
    }
}
