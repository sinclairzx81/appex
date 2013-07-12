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

    console.log('copying ' + sourcefile + '>' + outputfile);

    var readstream = fs.createReadStream(sourcefile);

    var writestream = fs.createWriteStream(outputfile);

    readstream.pipe(writestream);

    setTimeout(callback, 200)

}

function build(sourcefile, outputfile, callback) {

    console.log('building ' + sourcefile + ' to ' + outputfile);

    typescript.resolve([sourcefile], function(resolved) {

        error_handler(resolved)

        typescript.compile(resolved, function(compiled) {
        
            error_handler(compiled)
            
            var writestream = fs.createWriteStream(outputfile);

            for (var n in compiled) {

                 writestream.write(compiled[n].content);
            }
            
            writestream.end();

            setTimeout(callback, 400);
        });

    });
}

console.log('building appex...')

build('./node_modules/appex/index.ts', './bin/index.js', function(){ 

    copy('./package.json', './bin/package.json', function(){});

    copy('./readme.md',    './bin/readme.md',  function(){});

    copy('./bin/appex.d.ts',    './node_modules/appex/appex.d.ts',  function(){});

    copy('./node_modules/appex/workers/kernel.js', './node_modules/appex/kernel.js', function(){});

    copy('./node_modules/appex/workers/kernel.js', './bin/kernel.js', function(){ });
    
    copy('./bin/index.js', './node_modules/appex/index.js', function(){
                
        console.log('starting app.js');

        console.log('----------------------------------------------------');

        require('./app.js');
    });
   
});