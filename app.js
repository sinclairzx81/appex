var appex = require('appex');

var app = appex({ program : './program.ts', devmode : false, logging : true });

app.listen(5000);