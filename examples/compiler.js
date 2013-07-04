var appex = require('./bin/index.js');
 
var compiler = new appex.Compiler();

compiler.compile("./service.ts", function(result) {
    
    result.errors.forEach(function(error) {
        
        console.log(error);

    });

    if(result.errors.length == 0 ) {

        var module = new appex.Module(result.script, result.reflection);
        
        for (var n in module.handles) {

            var obj = module.get( module.handles[n] );
            
            if (module.handles[n].type.identifier == 'class') {

                var instance = new obj();

            }

            console.log(obj);
        }
    }

    compiler.dispose();
});
