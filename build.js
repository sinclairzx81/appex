var typescript = require('typescript.api');

var fs         = require('fs');

var error_handler = function(units)  {
    
    units.forEach(function(unit) {
                    
        unit.diagnostics.forEach(function(diagnostic) {

           console.log(diagnostic.toString());

        });
    });
}

function copy(sourcefile, outputfile, callback) {

    var readstream = fs.createReadStream(sourcefile);

    var writestream = fs.createWriteStream(outputfile);

    readstream.pipe(writestream);

    setTimeout(callback, 100)

}

function build(sourcefile, outputfile, callback) {

    typescript.resolve([sourcefile], function(resolved) {

        error_handler(resolved)

        typescript.compile(resolved, function(compiled) {
        
            error_handler(compiled)
            
            var writestream = fs.createWriteStream(outputfile);

            for (var n in compiled) {

                 writestream.write(compiled[n].content);
            }
            
            writestream.end();

            setTimeout(callback, 100);
        });

    });
}

build('./node_modules/appex/index.ts', './bin/index.js', function(){ 

    copy('./node_modules/appex/workers/kernel.js', './bin/kernel.js', function(){
        
        require('./app.js');
    })    
});