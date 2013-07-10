var appex = require('appex');

var app = appex({ program : './program.ts', devmode : true, logging : true });

//app.use(function(context, next) { });

app.listen(5000);