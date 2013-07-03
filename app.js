var appex = require('./bin/index.js');

//console.log(appex);

var compiler = new appex.compilers.Compiler();

compiler.compile("./service.ts", function(result) {
    
    result.errors.forEach(function(error) {
        
        console.log(error)

    });

    if(result.errors.length == 0 ) {

        var domain = new appex.runtime.Domain(result.script, result.reflection);

        console.log(domain.handles);

    }
    
    compiler.dispose();
});
