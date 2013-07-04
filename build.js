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

function build(sourcefile, outputfile, declfile, callback) {

    typescript.resolve([sourcefile], function(resolved) {

        error_handler(resolved)

        typescript.compile(resolved, function(compiled) {
        
            error_handler(compiled)
            
            var writestream = fs.createWriteStream(outputfile);

            for (var n in compiled) {

                 writestream.write(compiled[n].content);
            }
            
            writestream.end();

            var writestream = fs.createWriteStream(declfile);

            for (var n in compiled) {

                 var pattern = /\/\/\/ <reference path="(.*?)" \/>/g;

                 var content = compiled[n].declaration.replace(pattern, '');

                 writestream.write(content);
            }
            
            writestream.end();

            setTimeout(callback, 400);
        });

    });
}

console.log('building appex...')

build('./node_modules/appex/index.ts', './bin/index.js', './bin/appex.d.ts', function(){ 

    console.log('copying worker kernel...')

    copy('./node_modules/appex/workers/kernel.js', './bin/kernel.js', function(){

        console.log('copying worker kernel to node_modules...')

        copy('./node_modules/appex/workers/kernel.js', './node_modules/appex/kernel.js', function(){
            
            console.log('copying index to node_modules...')

            copy('./bin/index.js', './node_modules/appex/index.js', function(){
                
                console.log('starting app.js')

                require('./app.js');

            });
        }) 
    })    
});