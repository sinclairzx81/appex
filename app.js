var appex   = require('appex');

var server = appex.server({   sourcefile : './program.ts', 
                              devmode    : true, 
                              logging    : true,
                              context    : {
                                   message: 'hello'

                              }});
 
server.listen(5000);

 