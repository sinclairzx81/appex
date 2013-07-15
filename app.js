

var appex = require('appex');

var app = appex({ program : './program.ts', devmode : true, logging : true });

app.listen(5000);