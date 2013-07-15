export function sitemap (context) {
    
    // list out all URLS (needs work)

    context.module.exports.forEach((_export) => {
        
        var path = _export.type.scope.join('/') + '/' + _export.type.name;

        context.response.write(path + '\n');
    });

    context.response.end();
}