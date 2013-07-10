var appex = require('appex');

var app = appex({ program : './program.ts', devmode : false, logging : true });

app.listen(5000);

var units = ["studio\references.ts",
            "studio\references\lib.d.ts",
            "studio\references\node.d.ts",
            "studio\index.ts",
            "studio\reflection\index.ts",
            "studio\static\index.ts"];




