// Copyright (c) 2013 haydn paterson (sinclair).  All rights reserved.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/////////////////////////////////////////////////////////////////////
//
//  appex build utility.
//
//  for declarations, use:
//
//  tsc -out node_modules/appex/index.js node_modules/appex/index.ts -declaration -nolib -comments
//
/////////////////////////////////////////////////////////////////////

var typescript = require('./node_modules/appex/node_modules/typescript.api/index.js');

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

            writestream.write('/*--------------------------------------------------------------------------\n\n');

            writestream.write(fs.readFileSync('./license.txt') + '\n\n');

            writestream.write('--------------------------------------------------------------------------*/\n\n');

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

    copy('./node_modules/appex/appex.d.ts', './bin/appex.d.ts',  function(){});

    copy('./node_modules/appex/references/node.d.ts', './bin/references/node.d.ts',  function(){});

    copy('./node_modules/appex/references/typescript.api.d.ts', './bin/references/typescript.api.d.ts',  function(){});

    copy('./node_modules/appex/workers/kernel.js', './node_modules/appex/kernel.js', function(){});

    copy('./node_modules/appex/workers/kernel.js', './bin/kernel.js', function(){ });
    
    copy('./bin/index.js', './node_modules/appex/index.js', function(){
                
        console.log('starting app.js');

        console.log('----------------------------------------------------');

        require('./app.js');
    });
});