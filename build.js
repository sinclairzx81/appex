var typescript = require('typescript.api');

var fs         = require('fs');


function build(callback) {

    typescript.resolve(['./node_modules/appex/index.ts'], function(resolved) {

        typescript.compile(resolved, function(compiled) {
        
            var writestream = fs.createWriteStream('./node_modules/appex/index.js');

            for (var n in compiled) {

                 writestream.write(compiled[n].content);
            }

            writestream.end();

            setTimeout(function(){

                callback();

            }, 500);
        });

    });
}

build(function(){

    require('./app.js');
});