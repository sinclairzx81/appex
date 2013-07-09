var http    = require('http');

var appex   = require('appex');

//var middleware = appex.middleware ( {   sourcefile : './program.ts', 
//                                        devmode    : true, 
//                                        logging    : true,
//                                        context    : {
//                                            message: 'hello'

//                                        }});


var server = appex.server({   sourcefile : './program.ts', 
                              devmode    : true, 
                              logging    : true,
                              context    : {
                                   message: 'hello'

                              }});
 
server.listen(5000);

 